using MongoDB.Bson;
using System.Reflection;

namespace Business.Util
{
    public static class Util
    {
        public static void UpdateProperties<T, U>(T existingEntity, U updatedEntity)
        {
            foreach (PropertyInfo property in typeof(T).GetProperties())
            {
                object? existingValue = property.GetValue(existingEntity);
                object? updatedValue = property?.GetValue(updatedEntity);

                if (property?.Name == "CreatedBy" || property?.Name == "CreatedAt" || property?.Name == "Id")
                {
                    continue;
                }

                if (updatedValue != null && property!.CanWrite)
                {
                    property.SetValue(existingEntity, updatedValue);
                }
            }
        }
    }
}
