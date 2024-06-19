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
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    [AllArgsConstructor]
    public partial class ProductController : ControllerBase
    {
        private readonly IEntityService<Product, ProductRequest, ObjectId> _productService;
        private readonly IMapper _mapper;

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
