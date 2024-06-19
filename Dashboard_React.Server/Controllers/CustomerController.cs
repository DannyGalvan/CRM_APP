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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [AllArgsConstructor]
    public partial class CustomerController : ControllerBase
    {
        private readonly IEntityService<Customer, CustomerRequest, ObjectId> _customerService;
        private readonly IMapper _mapper;

        [HttpGet] 
        public IActionResult GetAll(string? filters)
        {
            var response = _customerService.GetAll(filters);

            if
            (response.Success)
            {
                Response<List<CustomerResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Customer>,List<CustomerResponse>>(response.Data!),
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
            var response = _customerService.GetById(ObjectId.Parse(id));

            if
            (response.Success)
            {
                Response<CustomerResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerResponse>(response.Data!),
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
        public IActionResult Create(CustomerRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _customerService.Create(model);
            if (response.Success)
            {
                Response<CustomerResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerResponse>(response.Data),
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
        public IActionResult Update(CustomerRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _customerService.Update(model);
            if (response.Success)
            {
                Response<CustomerResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerResponse>(response.Data),
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
        public IActionResult PartialUpdate(CustomerRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _customerService.PartialUpdate(model);
            if (response.Success)
            {
                Response<CustomerResponse> successResponse = new()
                {
                    Data = _mapper.Map<CustomerResponse>(response.Data),
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
