using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using static System.Decimal;

public class DictionaryDecimalSerializer : SerializerBase<IDictionary<string, decimal>>
{
    public override void Serialize(BsonSerializationContext context, BsonSerializationArgs args, IDictionary<string, decimal> value)
    {
        context.Writer.WriteStartDocument();

        foreach (var kvp in value)
        {
            context.Writer.WriteName(kvp.Key);
            context.Writer.WriteDecimal128(kvp.Value);
        }

        context.Writer.WriteEndDocument();
    }

    public override IDictionary<string, decimal> Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var dictionary = new Dictionary<string, decimal>();
        var bsonReader = context.Reader;

        bsonReader.ReadStartDocument();

        while (bsonReader.State != BsonReaderState.EndOfDocument)
        {
            var key = bsonReader.ReadName();
            var value = bsonReader.ReadDecimal128().ToString();
            dictionary.Add(key, Parse(value));
        }

        bsonReader.ReadEndDocument();

        return dictionary;
    }
}

