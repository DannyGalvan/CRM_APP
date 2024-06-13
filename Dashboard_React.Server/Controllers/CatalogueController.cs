using AutoMapper;
using Business.Interfaces;
using Business.Validations.Catalog;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Claims;

namespace Dashboard_React.Server.Controllers
{
    [Authorize]
    [Route("api/{catalogue}")]
    [ApiController]
    public class CatalogueController(ICatalogueService service, IMapper mapper) : ControllerBase
    {
        private readonly ICatalogueService _service = service;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public IActionResult GetAll(string catalogue, [FromQuery] string? filters)
        {
            Response<List<Catalogue>, List<ValidationFailure>> response;

            response = _service.GetAll(catalogue, filters);

            if (response.Success)
            {
                Response<List<CatalogueResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Catalogue>,List<CatalogueResponse>>(response.Data!),
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
        public IActionResult GetById(string catalogue, string id)
        {
            var response = _service.GetById(ObjectId.Parse(id), catalogue);
            if (response.Success)
            {
                Response<CatalogueResponse> successResponse = new()
                {
                    Data = _mapper.Map<CatalogueResponse>(response.Data),
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
        public IActionResult Create(string catalogue, [FromBody] CatalogueRequest request)
        {
            request.CreatedBy = GetUserId();
            var response = _service.Create(request, new CreateCatalogValidator(), catalogue);
            if (response.Success)
            {
                Response<CatalogueResponse> successResponse = new()
                {
                    Data = _mapper.Map<CatalogueResponse>(response.Data),
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
        public IActionResult Update(string catalogue, [FromBody] CatalogueRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _service.Update(request, new UpdateCatalogValidator(), catalogue);
            if (response.Success)
            {
                Response<CatalogueResponse> successResponse = new()
                {
                    Data = _mapper.Map<CatalogueResponse>(response.Data),
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
        public IActionResult Patch(string catalogue, [FromBody] CatalogueRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _service.PartialUpdate(request, new PartialUpdateCatalogValidator(), catalogue);
            if (response.Success)
            {
                Response<CatalogueResponse> successResponse = new()
                {
                    Data = _mapper.Map<CatalogueResponse>(response.Data),
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
