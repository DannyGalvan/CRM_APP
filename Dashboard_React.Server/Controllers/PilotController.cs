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
    [AllArgsConstructor]
    [Route("api/v1/[controller]")]
    [ApiController]
    public partial class PilotController : ControllerBase
    {
        private readonly IEntityService<Pilot, PilotRequest, ObjectId> _pilotService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "Pilot.List")]
        public IActionResult GetAll(string? filters)
        {
            var response = _pilotService.GetAll(filters);

            if
                (response.Success)
            {
                Response<List<PilotResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Pilot>, List<PilotResponse>>(response.Data!),
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
        [Authorize(Policy = "Pilot.List")]
        public IActionResult GetById(string id)
        {
            var response = _pilotService.GetById(ObjectId.Parse(id));

            if
                (response.Success)
            {
                Response<PilotResponse> successResponse = new()
                {
                    Data = _mapper.Map<PilotResponse>(response.Data!),
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
        [Authorize(Policy = "Pilot.Create")]
        public IActionResult Create(PilotRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _pilotService.Create(model);
            if (response.Success)
            {
                Response<PilotResponse> successResponse = new()
                {
                    Data = _mapper.Map<PilotResponse>(response.Data),
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
        [Authorize(Policy = "Pilot.Update")]
        public IActionResult Update(PilotRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _pilotService.Update(model);
            if (response.Success)
            {
                Response<PilotResponse> successResponse = new()
                {
                    Data = _mapper.Map<PilotResponse>(response.Data),
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
        [Authorize(Policy = "Pilot.Patch")]
        public IActionResult PartialUpdate(PilotRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _pilotService.PartialUpdate(model);
            if (response.Success)
            {
                Response<PilotResponse> successResponse = new()
                {
                    Data = _mapper.Map<PilotResponse>(response.Data),
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
