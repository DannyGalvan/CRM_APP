using AutoMapper;
using Business.Interfaces;
using Business.Validations.Product;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;

namespace Dashboard_React.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProductController(IEntityService<Product, ProductRequest, ObjectId> productService, IMapper mapper) : ControllerBase
    {
        private readonly IEntityService<Product, ProductRequest, ObjectId> _productService = productService;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public IActionResult GetAll(string? filters)
        {
            var response = _productService.GetAll(filters);

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
            else
            {
                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [HttpGet("{id}")]
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
            else
            {
                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [HttpPost]
        public IActionResult Create(ProductRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _productService.Create(model, new CreateProductValidator());
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
            else
            {

                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [HttpPut]
        public IActionResult Update(ProductRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _productService.Update(model, new UpdateProductValidator());
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
            else
            {

                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [HttpPatch]
        public IActionResult PartialUpdate(ProductRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _productService.PartialUpdate(model, new PartialUpdateProductValidator());
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
            else
            {

                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        private string GetUserId()
        {
            Claim? claimId = User.FindFirst(ClaimTypes.NameIdentifier);

            return claimId != null ? claimId.Value : ObjectId.Empty.ToString();
        }
    }
}
