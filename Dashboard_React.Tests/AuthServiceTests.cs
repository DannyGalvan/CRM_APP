using AutoMapper;
using Business.Interfaces;
using Business.Services;
using Entities.Configurations;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Moq;

namespace Dashboard_React.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IOptions<AppSettings>> _mockAppSettings;
        private readonly Mock<ICRMContext> _mockContext;
        private readonly Mock<ISendMail> _mockSendMail;
        private readonly Mock<IMapper> _mockMapper;

        public AuthServiceTests()
        {
            _mockAppSettings = new Mock<IOptions<AppSettings>>();
            _mockSendMail = new Mock<ISendMail>();
            _mockMapper = new Mock<IMapper>();
            _mockContext = new Mock<ICRMContext>();

            _mockAppSettings.Setup(a => a.Value).Returns(new AppSettings
            {
                Secret = "some_secret_key",
                TokenExpirationHrs = 1,
                NotBefore = 0,
                UrlClient = "http://localhost"
            });              
        }

        [Fact]
        public void Auth_WithInvalidModel_ShouldReturnErrors()
        {
            // Arrange
            var loginRequest = new LoginRequest { UserName = "invalidUser", Password = "invalidPassword" };

            var userCollectionMock = new Mock<IMongoCollection<User>>();

            var mockCursor = new Mock<IAsyncCursor<User>>();

            mockCursor.SetupSequence(cursor => cursor.MoveNext(It.IsAny<CancellationToken>()))
                .Returns(true)
                .Returns(false);

            mockCursor.Setup(cursor => cursor.Current).Returns(new List<User> { }.AsReadOnly());

            userCollectionMock.Setup(collection => collection.FindSync(It.IsAny<FilterDefinition<User>>(), It.IsAny<FindOptions<User, User>>(), default))
                .Returns(mockCursor.Object);

            _mockContext.Setup(ctx => ctx.Database.GetCollection<User>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()))
                .Returns(userCollectionMock.Object);

            IAuthService _authService = new AuthService(_mockAppSettings.Object, _mockContext.Object, _mockSendMail.Object, _mockMapper.Object);
            // Act
            var result = _authService.Auth(loginRequest);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Usuario y/o contraseña invalidos", result.Message);
        }
    }
}
