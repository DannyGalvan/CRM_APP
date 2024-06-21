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
    [Route("api/v1/{catalogue}")]
    [ApiController]
    [AllArgsConstructor]
    public partial class CatalogueController : ControllerBase
    {
        private readonly ICatalogueService _service;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "Catalogue.List")]
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
        [Authorize(Policy = "Catalogue.List")]
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
        [Authorize(Policy = "Catalogue.Create")]
        public IActionResult Create(string catalogue, [FromBody] CatalogueRequest request)
        {
            request.CreatedBy = GetUserId();
            var response = _service.Create(request, catalogue);

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
        [Authorize(Policy = "Catalogue.Update")]
        public IActionResult Update(string catalogue, [FromBody] CatalogueRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _service.Update(request, catalogue);
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
        [Authorize(Policy = "Catalogue.Patch")]
        public IActionResult Patch(string catalogue, [FromBody] CatalogueRequest request)
        {
            request.UpdatedBy = GetUserId();
            var response = _service.PartialUpdate(request, catalogue);
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
