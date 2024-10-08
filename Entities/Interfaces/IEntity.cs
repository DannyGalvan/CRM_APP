﻿using MongoDB.Bson;


namespace Entities.Interfaces
{
    public interface IEntity<TIdEntity>
    {
        TIdEntity Id { get; set; }
        DateTime CreatedAt { get; set; }
        ObjectId CreatedBy { get; set; }
        ObjectId? UpdatedBy { get; set; }
        DateTime? UpdatedAt { get; set; }
    }
}
