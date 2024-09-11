using AutoMapper;
using Business.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Lombok.NET;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;

namespace Dashboard_React.Server.Controllers
{
    [Route("api/v1/[controller]")]
    [Authorize]
    [ApiController]
    [AllArgsConstructor]
    public partial class ProductController : ControllerBase
    {
        private readonly IEntityService<Product, ProductRequest, ObjectId> _productService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "Product.List")]
        public IActionResult GetAll(string? filters, bool? thenInclude)
        {
            var response = _productService.GetAll(filters, thenInclude ?? false);

            if
            (response.Success)
            {
                Response<List<ProductResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Product>, List<ProductResponse>>(response.Data!),
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(successResponse);
            }

            Response<List<ValidationFailure>> errorResponse = new()
            {
                Data = response.Errors,
                Success = response.Success,
                Message = response.Message
            };

            return BadRequest(errorResponse);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "Product.List")]
        public IActionResult GetById(string id)
        {
            var response = _productService.GetById(ObjectId.Parse(id));

            if
            (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data!),
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(successResponse);
            }

            Response<List<ValidationFailure>> errorResponse = new()
            {
                Data = response.Errors,
                Success = response.Success,
                Message = response.Message
            };

            return BadRequest(errorResponse);
        }

        [HttpPost]
        [Authorize(Policy = "Product.Create")]
        public IActionResult Create(ProductRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _productService.Create(model);
            if (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data),
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(successResponse);
            }

            Response<List<ValidationFailure>> errorResponse = new()
            {
                Data = response.Errors,
                Success = response.Success,
                Message = response.Message
            };

            return BadRequest(errorResponse);
        }

        [HttpPut]
        [Authorize(Policy = "Product.Update")]
        public IActionResult Update(ProductRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _productService.Update(model);
            if (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data),
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(successResponse);
            }

            Response<List<ValidationFailure>> errorResponse = new()
            {
                Data = response.Errors,
                Success = response.Success,
                Message = response.Message
            };

            return BadRequest(errorResponse);
        }

        [HttpPatch]
        [Authorize(Policy = "Product.Patch")]
        public IActionResult PartialUpdate(ProductRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _productService.PartialUpdate(model);
            if (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data),
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(successResponse);
            }

            Response<List<ValidationFailure>> errorResponse = new()
            {
                Data = response.Errors,
                Success = response.Success,
                Message = response.Message
            };

            return BadRequest(errorResponse);
        }

        private string GetUserId()
        {
            Claim? claimId = User.FindFirst(ClaimTypes.NameIdentifier);

            return claimId != null ? claimId.Value : ObjectId.Empty.ToString();
        }
    }
}
