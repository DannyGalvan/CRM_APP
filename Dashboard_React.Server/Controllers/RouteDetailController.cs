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
    public partial class RouteDetailController : ControllerBase
    {
        private readonly IRouteDetailService _routeDetailService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "RouteDetail.List")]
        public IActionResult GetAll(string? filters)
        {
            var response = _routeDetailService.GetAll(filters);

            if (response.Success)
            {
                Response<List<RouteDetailResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<RouteDetail>, List<RouteDetailResponse>>(response.Data!),
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
        [Authorize(Policy = "RouteDetail.List")]
        public IActionResult GetById(string id)
        {
            var response = _routeDetailService.GetById(ObjectId.Parse(id));

            if (response.Success)
            {
                Response<RouteDetailResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteDetailResponse>(response.Data!),
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
        [Authorize(Policy = "RouteDetail.Create")]
        public IActionResult Create(RouteDetailRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _routeDetailService.Create(model);
            if (response.Success)
            {
                Response<RouteDetailResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteDetailResponse>(response.Data),
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

        [HttpPost("Bulk")]
        [Authorize(Policy = "RouteDetail.Bulk")]
        public IActionResult Create(BulkRouteDetailRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _routeDetailService.Bulk(model);
            if (response.Success)
            {
                Response<List<RouteDetailResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<RouteDetail>, List<RouteDetailResponse>>(response.Data!),
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
        [Authorize(Policy = "RouteDetail.Update")]
        public IActionResult Update(RouteDetailRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _routeDetailService.Update(model);
            if (response.Success)
            {
                Response<RouteDetailResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteDetailResponse>(response.Data),
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
        [Authorize(Policy = "RouteDetail.Patch")]
        public IActionResult PartialUpdate(RouteDetailRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _routeDetailService.PartialUpdate(model);
            if (response.Success)
            {
                Response<RouteDetailResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteDetailResponse>(response.Data),
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
