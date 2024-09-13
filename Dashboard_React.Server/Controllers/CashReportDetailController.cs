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
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    [AllArgsConstructor]
    public partial class CashReportDetailController : ControllerBase
    {
        private readonly ICashReportDetailService _cashReportDetailService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "CashReportDetail.List")]
        public IActionResult GetAll(string? filters, bool? thenInclude)
        {
            var response = _cashReportDetailService.GetAll(filters, thenInclude ?? false);

            if (response.Success)
            {
                Response<List<CashReportDetailResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<CashReportDetail>, List<CashReportDetailResponse>>(response.Data!),
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
        [Authorize(Policy = "CashReportDetail.List")]
        public IActionResult GetById(string id)
        {
            var response = _cashReportDetailService.GetById(ObjectId.Parse(id));

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
        [Authorize(Policy = "CashReportDetail.Create")]
        public IActionResult Create(CashReportDetailRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _cashReportDetailService.Create(model);
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
        [Authorize(Policy = "CashReportDetail.BulkCreate")]
        public IActionResult Create(BulkCashReportDetailRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _cashReportDetailService.Bulk(model);
            if (response.Success)
            {
                Response<List<CashReportDetailResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<CashReportDetail>, List<CashReportDetailResponse>>(response.Data!),
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
        [Authorize(Policy = "CashReportDetail.Update")]
        public IActionResult Update(CashReportDetailRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _cashReportDetailService.Update(model);
            if (response.Success)
            {
                Response<CashReportDetailResponse> successResponse = new()
                {
                    Data = _mapper.Map<CashReportDetailResponse>(response.Data),
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
        [Authorize(Policy = "CashReportDetail.Patch")]
        public IActionResult PartialUpdate(CashReportDetailRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _cashReportDetailService.PartialUpdate(model);
            if (response.Success)
            {
                Response<CashReportDetailResponse> successResponse = new()
                {
                    Data = _mapper.Map<CashReportDetailResponse>(response.Data),
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
