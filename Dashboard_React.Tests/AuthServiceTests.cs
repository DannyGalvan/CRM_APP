﻿using AutoMapper;
using Business.Interfaces;
using Business.Services;
using Business.Validations.Auth;
using Entidades.Request;
using Entities.Configurations;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using FluentValidation;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Moq;

namespace Dashboard_React.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IOptions<AppSettings>> _mockAppSettings;
        private readonly Mock<ICrmContext> _mockContext;
        private readonly Mock<ISendMail> _mockSendMail;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<LoginValidations> _mockLoginValidations;
        private readonly Mock<IValidator<ChangePasswordRequest>> _mockChangePasswordValidations;
        private readonly Mock<IValidator<ResetPasswordRequest>> _mockResetPasswordValidator;
        private readonly Mock<IValidator<RecoveryPasswordRequest>> _mockRecoveryPasswordValidator;
        private readonly Mock<ILogger<AuthService>> _mockLogger;

        public AuthServiceTests()
        {
            _mockAppSettings = new Mock<IOptions<AppSettings>>();
            _mockSendMail = new Mock<ISendMail>();
            _mockMapper = new Mock<IMapper>();
            _mockContext = new Mock<ICrmContext>();
            _mockLoginValidations = new Mock<LoginValidations>();
            _mockChangePasswordValidations = new Mock<IValidator<ChangePasswordRequest>>();
            _mockResetPasswordValidator = new Mock<IValidator<ResetPasswordRequest>>();
            _mockRecoveryPasswordValidator = new Mock<IValidator<RecoveryPasswordRequest>>();
            _mockLogger = new Mock<ILogger<AuthService>>();

            _mockAppSettings.Setup(a => a.Value).Returns(new AppSettings
            {
                Secret = "some_secret_key",
                TokenExpirationHrs = 1,
                NotBefore = 0,
                UrlClient = "http://localhost"
            });

            _mockLoginValidations.Setup(v => v.Validate(It.IsAny<ValidationContext<LoginRequest>>()))
                .Returns(new FluentValidation.Results.ValidationResult());

            _mockChangePasswordValidations.Setup(v => v.Validate(It.IsAny<ValidationContext<ChangePasswordRequest>>()))
                .Returns(new FluentValidation.Results.ValidationResult());

            _mockResetPasswordValidator.Setup(v => v.Validate(It.IsAny<ValidationContext<ResetPasswordRequest>>()))
                .Returns(new FluentValidation.Results.ValidationResult());

            _mockRecoveryPasswordValidator.Setup(v => v.Validate(It.IsAny<ValidationContext<RecoveryPasswordRequest>>()))
                .Returns(new FluentValidation.Results.ValidationResult());
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

            AuthService _authService = new (_mockContext.Object,
                                            _mockAppSettings.Object,
                                            _mockSendMail.Object,
                                            _mockMapper.Object,
                                            _mockLoginValidations.Object,
                                            _mockChangePasswordValidations.Object,
                                            _mockResetPasswordValidator.Object,
                                            _mockRecoveryPasswordValidator.Object,
                                            _mockLogger.Object
                                            );
            // Act
            var result = _authService.Auth(loginRequest);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Usuario y/o contraseña invalidos", result.Message);
        }
    }
}
