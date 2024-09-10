using AutoMapper;
using Business.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using Lombok.NET;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;
using FluentValidation.Results;

namespace Dashboard_React.Server.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    [AllArgsConstructor]
    public partial class CustomerDirectionController : ControllerBase
    {
        private readonly IEntityService<CustomerDirection, CustomerDirectionRequest, ObjectId> _customerDirectionService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "CustomerDirection.List")]
        public IActionResult GetAll(string? filters)
        {
            var response = _customerDirectionService.GetAll(filters);

            if
            (response.Success)
            {
                Response<List<CustomerDirectionResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<CustomerDirection>, List<CustomerDirectionResponse>>(response.Data!),
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
        [Authorize(Policy = "CustomerDirection.List")]
        public IActionResult GetById(string id)
        {
            var response = _customerDirectionService.GetById(ObjectId.Parse(id));

            if
            (response.Success)
            {
                Response<CustomerDirectionResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerDirectionResponse>(response.Data!),
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
        [Authorize(Policy = "CustomerDirection.Create")]
        public IActionResult Create(CustomerDirectionRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _customerDirectionService.Create(model);
            if (response.Success)
            {
                Response<CustomerDirectionResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerDirectionResponse>(response.Data),
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
        [Authorize(Policy = "CustomerDirection.Update")]
        public IActionResult Update(CustomerDirectionRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _customerDirectionService.Update(model);
            if (response.Success)
            {
                Response<CustomerDirectionResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerDirectionResponse>(response.Data),
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
        [Authorize(Policy = "CustomerDirection.Patch")]
        public IActionResult PartialUpdate(CustomerDirectionRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _customerDirectionService.PartialUpdate(model);
            if (response.Success)
            {
                Response<CustomerDirectionResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerDirectionResponse>(response.Data),
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
