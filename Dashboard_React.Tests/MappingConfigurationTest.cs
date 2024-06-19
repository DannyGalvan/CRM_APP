using AutoMapper;
using AutoMapper.EquivalencyExpression;
using Business.Mappers;
using Microsoft.AspNetCore.Hosting;
using Moq;

namespace Dashboard_React.Tests
{
    public class MappingConfigurationTest
    {
        private readonly Mock<IWebHostEnvironment> _builder;

        public MappingConfigurationTest()
        {
            _builder = new Mock<IWebHostEnvironment>();
        }

        [Fact]
        public void WhenProfilesAreConfigured_ItShouldNotThrowException()
        {
            // Arrange
            var config = new MapperConfiguration(configuration =>
            {
                configuration.AddProfile(new MappingProfile(_builder.Object));
                configuration.AddCollectionMappers();
            });

            // Assert
            config.AssertConfigurationIsValid();
        }
    }
}
