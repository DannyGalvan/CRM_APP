using AutoMapper;
using Business.Interfaces;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Lombok.NET;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;
using Route = Entities.Models.Route;

namespace Dashboard_React.Server.Controllers
{
    [Route("api/v1/[controller]")]
    [Authorize]
    [ApiController]
    [AllArgsConstructor]
    public partial class RouteController : ControllerBase
    {
        private readonly IEntityService<Route, RouteRequest, ObjectId> _routeService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "Route.List")]
        public IActionResult GetAll(string? filters, bool? thenInclude, int page = 1, int pageSize = 30)
        {
            var response = _routeService.GetAll(filters, thenInclude ?? false, page, pageSize);

            if
                (response.Success)
            {
                Response<List<RouteResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Route>, List<RouteResponse>>(response.Data!),
                    Success = response.Success,
                    Message = response.Message,
                    TotalResults = response.TotalResults
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
        [Authorize(Policy = "Route.List")]
        public IActionResult GetById(string id)
        {
            var response = _routeService.GetById(ObjectId.Parse(id));

            if(response.Success)
            {
                Response<RouteResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteResponse>(response.Data!),
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
        [Authorize(Policy = "Route.Create")]
        public IActionResult Create(RouteRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _routeService.Create(model);
            if (response.Success)
            {
                Response<RouteResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteResponse>(response.Data),
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
        [Authorize(Policy = "Route.Update")]
        public IActionResult Update(RouteRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _routeService.Update(model);
            if (response.Success)
            {
                Response<RouteResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteResponse>(response.Data),
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
        [Authorize(Policy = "Route.Patch")]
        public IActionResult PartialUpdate(RouteRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _routeService.PartialUpdate(model);
            if (response.Success)
            {
                Response<RouteResponse> successResponse = new()
                {
                    Data = _mapper.Map<RouteResponse>(response.Data),
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
