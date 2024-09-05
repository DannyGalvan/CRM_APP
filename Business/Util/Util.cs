using System.Reflection;
using Entities.Models;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;

namespace Business.Util
{
    public static class Util
    {
        public static void UpdateProperties<TDestination, TSource>(TDestination existingEntity, TSource updatedEntity)
        {
            foreach (PropertyInfo property in typeof(TDestination).GetProperties())
            {
                //object? existingValue = property.GetValue(existingEntity);
                object? updatedValue = property.GetValue(updatedEntity);

                if (property.Name == "CreatedBy" || property.Name == "CreatedAt" || property.Name == "Id" || property.Name == "OrderDate" || property.Name == "DeliveryDate")
                {
                    continue;
                }

                if (updatedValue != null && property.CanWrite)
                {
                    if (updatedValue is ObjectId && updatedValue.ToString() == ObjectId.Empty.ToString())
                    {
                        continue;
                    }

                    if (updatedValue is decimal && decimal.Parse(updatedValue.ToString()!) == 0M)
                    {
                        continue;
                    }

                    if (updatedValue is List<OrderDetail> list)
                    {
                        if (list!.IsNullOrEmpty())
                        {
                            continue;
                        }
                    }
                    
                    property.SetValue(existingEntity, updatedValue);
                }
            }
        }
    }
}
