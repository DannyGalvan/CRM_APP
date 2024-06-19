﻿using AutoMapper;
using Business.Interfaces;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Humanizer;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Services
{
    public partial class CalendarEventService(IMapper mapper, IMongoContext mongo, IServiceProvider serviceProvider) : EntityService<Event, EventRequest, ObjectId>(mongo, mapper, serviceProvider), ICalendarEventService
    {
        private readonly IMongoContext _mongo = mongo;

        public List<Event> GetAllEventsByUser(ObjectId userId, DateTime start, DateTime end)
        {
            List<Event> events = [];

            try
            {
                string nameCollection = typeof(Event).Name.Pluralize();

                IMongoCollection<Event> collection = _mongo.Database.GetCollection<Event>(nameCollection);

                FilterDefinitionBuilder<Event> filterBuilder = Builders<Event>.Filter;
                FilterDefinition<Event> filter = filterBuilder.Eq("UserId", userId)
                    & filterBuilder.Gte("StartDate", start.ToUniversalTime())
                    & filterBuilder.Lte("StartDate", end.ToUniversalTime())
                    & filterBuilder.Eq("IsActive", true);

                List<Event> searchResult = collection.Find(filter).ToList();

                events = searchResult;

                return events;
            }
            catch (Exception)
            {

                return events;
            }
        }
    }
}
