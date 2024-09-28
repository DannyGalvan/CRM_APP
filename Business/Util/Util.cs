using System.Reflection;
using System.Text.Json;
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
                object? existingValue = property.GetValue(existingEntity);
                object? updatedValue = property.GetValue(updatedEntity);

                switch (property.Name)
                {
                    case "CreatedAt" or "OrderDate" or "DeliveryDate":
                        existingValue = Convert.ToDateTime(existingValue).AddHours(6);
                        property.SetValue(existingEntity, existingValue);
                        continue;
                    case "Id":
                        continue;
                    case "CreatedBy":
                        continue;
                }

                if (updatedValue == null || !property.CanWrite) continue;
                switch (updatedValue)
                {
                    case ObjectId when updatedValue.ToString() == ObjectId.Empty.ToString():
                    case decimal when decimal.Parse(updatedValue.ToString()!) == 0M:
                    case List<OrderDetail> list when list!.IsNullOrEmpty():
                    case Dictionary<string, decimal> { Count: 0 }:
                    case int when int.Parse(updatedValue.ToString()!) == 0 && property.Name == "OrdersQuantity":
                        continue;
                    default:
                        property.SetValue(existingEntity, updatedValue);
                        break;
                }
            }
        }
    }
}
