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
    [ApiController]
    [AllArgsConstructor]
    public partial class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "Order.List")]
        public IActionResult GetAll(string? filters, bool? thenInclude)
        {
            var response = _orderService.GetAll(filters, thenInclude ?? false);

            if(response.Success)
            {
                Response<List<OrderResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Order>, List<OrderResponse>>(response.Data!),
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
        [Authorize(Policy = "Order.List")]
        public IActionResult GetById(string id)
        {
            var response = _orderService.GetById(ObjectId.Parse(id));

            if(response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
        [Authorize(Policy = "Order.Create")]
        public IActionResult Create(OrderRequest request)
        {
            request.CreatedBy = GetUserId();
            var response = _orderService.Create(request);

            if(response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
        [Authorize(Policy = "Order.Update")]
        public IActionResult Update(OrderRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _orderService.Update(request);

            if(response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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
        [Authorize(Policy = "Order.Patch")]
        public IActionResult Patch(OrderRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _orderService.PartialUpdate(request);

            if(response.Success)
            {
                Response<OrderResponse> successResponse = new()
                {
                    Data = _mapper.Map<Order, OrderResponse>(response.Data!),
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

        [HttpPatch("Bulk")]
        [Authorize(Policy = "Order.BulkPartialUpdate")]
        public IActionResult BulkUpdate(BulkUpdateOrderRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _orderService.BulkUpdate(model);
            if (response.Success)
            {
                Response<List<OrderResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Order>, List<OrderResponse>>(response.Data!),
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
