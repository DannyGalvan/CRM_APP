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
    public partial class CollectionController : ControllerBase
    {
        private readonly IEntityService<Collection, CollectionRequest, ObjectId> _collectionService;
        private readonly IMapper _mapper;

        [HttpGet]
        [Authorize(Policy = "Collection.List")]
        public IActionResult GetAll(string? filters)
        {
            var response = _collectionService.GetAll(filters);

            if
            (response.Success)
            {
                Response<List<CollectionResponse>> successResponse = new()
                {
                    Data = _mapper.Map<List<Collection>, List<CollectionResponse>>(response.Data!),
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
        [Authorize(Policy = "Collection.List")]
        public IActionResult GetById(string id)
        {
            var response = _collectionService.GetById(ObjectId.Parse(id));

            if
            (response.Success)
            {
                Response<CollectionResponse> successResponse = new()
                {
                    Data = _mapper.Map<CollectionResponse>(response.Data!),
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
        [Authorize(Policy = "Collection.Create")]
        public IActionResult Create(CollectionRequest model)
        {
            model.CreatedBy = GetUserId();
            var response = _collectionService.Create(model);
            if (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data),
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
        [Authorize(Policy = "Collection.Update")]
        public IActionResult Update(CollectionRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _collectionService.Update(model);
            if (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data),
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
        [Authorize(Policy = "Collection.Patch")]
        public IActionResult PartialUpdate(CollectionRequest model)
        {
            model.UpdatedBy = GetUserId();
            var response = _collectionService.PartialUpdate(model);
            if (response.Success)
            {
                Response<ProductResponse> successResponse = new()
                {
                    Data = _mapper.Map<ProductResponse>(response.Data),
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
