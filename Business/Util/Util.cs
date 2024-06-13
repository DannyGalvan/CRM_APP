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

                if (updatedValue != null && property!.CanWrite)
                {
                    if (updatedValue is ObjectId updatedObjectId && existingValue is ObjectId existingObjectId )
                    {
                        if (updatedObjectId == ObjectId.Empty)
                        {
                            continue;
                        }

                        property.SetValue(existingEntity, updatedObjectId);
                    }
                    else if (updatedValue is DateTime updatedDateTime && existingValue is DateTime existingDateTime)
                    {
                        // Aquí puedes agregar cualquier lógica adicional específica para DateTime si es necesario
                        updatedDateTime = updatedDateTime.ToUniversalTime();

                        property.SetValue(existingEntity, updatedDateTime);
                    }
                    else if (updatedValue is not DateTime)
                    {
                        // Para cualquier otro tipo que no sea DateTime
                        property.SetValue(existingEntity, updatedValue);
                    }
                }
            }
        }
    }
}
