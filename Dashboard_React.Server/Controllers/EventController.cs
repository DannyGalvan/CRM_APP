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
    public partial class EventController : ControllerBase
    {
        private readonly ICalendarEventService _eventService;
        private readonly IMapper _mapper;

        [HttpGet]
        public IActionResult GetAllEventsByUser(DateTime? start, DateTime? end)
        {
            DateTime startDate = start ?? DateTime.Now;
            DateTime endDate = end ?? DateTime.Now.AddMonths(1);

            List<EventResponse> response = _mapper
                .Map<List<Event>, List<EventResponse>>(_eventService.GetAllEventsByUser(GetUserId(), startDate, endDate));

            return Ok(response);
        }

        [HttpPost]
        public IActionResult Create(EventRequest model)
        {
            model.UserId = GetUserId();
            model.CreatedBy = GetUserId().ToString();
            var response = _eventService.Create(model);
            if (response.Success)
            {
                Response<EventResponse> successResponse = new()
                {
                    Data = _mapper.Map<EventResponse>(response.Data),
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
        public IActionResult Update(EventRequest model)
        {
            model.UserId = GetUserId();
            model.UpdatedBy = GetUserId().ToString();
            var response = _eventService.Update(model);
            if (response.Success)
            {
                Response<EventResponse> successResponse = new()
                {
                    Data = _mapper.Map<EventResponse>(response.Data),
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
        public IActionResult PartialUpdate(EventRequest model)
        {
            model.UserId = GetUserId();
            model.UpdatedBy = GetUserId().ToString();
            var response = _eventService.PartialUpdate(model);
            if (response.Success)
            {
                Response<EventResponse> successResponse = new()
                {
                    Data = _mapper.Map<EventResponse>(response.Data),
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

        private ObjectId GetUserId()
        {
            Claim? claimId = User.FindFirst(ClaimTypes.NameIdentifier);

            return claimId != null ? ObjectId.Parse(claimId.Value) : ObjectId.Empty;
        }
    }
}
