using MongoDB.Bson;

namespace Entities.Enums
{
    public static class OrderStatuses
    {
        public static readonly ObjectId Created = ObjectId.Parse("667a0b4ea82250a2c13748c2");
        public static readonly ObjectId HasRoute = ObjectId.Parse("667a0b58a82250a2c13748c3");
        public static readonly ObjectId Dispatched = ObjectId.Parse("667a0b64a82250a2c13748c4");
        public static readonly ObjectId Delivered = ObjectId.Parse("667a0b72a82250a2c13748c5");
        public static readonly ObjectId Deleted = ObjectId.Parse("66d4e2be0cb8112b950ab12f");
    }
}
