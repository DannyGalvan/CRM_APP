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
    [Route("api/v1/[controller]")]
    [ApiController]
    [AllArgsConstructor]
    public partial class CashReportController : ControllerBase
    {
        private readonly IEntityService<CashReport, CashReportRequest, ObjectId> _cashReportService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "CashReport.List")]
        public IActionResult GetAll(string? filters, bool? thenInclude)
        {
            var response = _cashReportService.GetAll(filters, thenInclude ?? false);

            if
            (response.Success)
            {
                Response<List<CashReportResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<CashReport>, List<CashReportResponse>>(response.Data!),
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
        [Authorize(Policy = "CashReport.List")]
        public IActionResult GetById(string id)
        {
            var response = _cashReportService.GetById(ObjectId.Parse(id));

            if
            (response.Success)
            {
                Response<CashReportResponse> successResponse = new()
                {
                    Data = _mapper.Map<CashReportResponse>(response.Data!),
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
        [Authorize(Policy = "CashReport.Create")]
        public IActionResult Create(CashReportRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _cashReportService.Create(model);
            if (response.Success)
            {
                Response<CashReportResponse> successResponse = new()
                {
                    Data = _mapper.Map<CashReportResponse>(response.Data),
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
        [Authorize(Policy = "CashReport.Update")]
        public IActionResult Update(CashReportRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _cashReportService.Update(model);
            if (response.Success)
            {
                Response<CashReportResponse> successResponse = new()
                {
                    Data = _mapper.Map<CashReportResponse>(response.Data),
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
        [Authorize(Policy = "CashReport.Patch")]
        public IActionResult PartialUpdate(CashReportRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _cashReportService.PartialUpdate(model);
            if (response.Success)
            {
                Response<CashReportResponse> successResponse = new()
                {
                    Data = _mapper.Map<CashReportResponse>(response.Data),
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
