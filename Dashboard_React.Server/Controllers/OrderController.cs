using AutoMapper;
using Business.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Lombok.NET;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;

namespace Dashboard_React.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllArgsConstructor]
    public partial class OrderController : ControllerBase
    {
        private readonly IEntityService<Order, OrderRequest, ObjectId> _orderService;
        private readonly IMapper _mapper;

        [HttpGet]
        public IActionResult GetAll(string? filters)
        {
            var response = _orderService.GetAll(filters);

            if
            (response.Success)
            {
                Response<List<OrderResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Order>, List<OrderResponse>>(response.Data!),
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
            var response = _orderService.GetById(ObjectId.Parse(id));

            if
            (response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
        public IActionResult Create(OrderRequest request)
        {
            request.CreatedBy = GetUserId();
            var response = _orderService.Create(request);

            if
            (response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
        public IActionResult Update(OrderRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _orderService.Update(request);

            if
            (response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
        public IActionResult Patch(OrderRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _orderService.PartialUpdate(request);

            if
            (response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
