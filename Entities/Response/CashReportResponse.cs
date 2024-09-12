﻿using MongoDB.Bson;
using System.Text.Json.Serialization;

namespace Entities.Response
{
    public class CashReportResponse
    {
        public string Id { get; set; } = string.Empty;
        public string CashierName { get; set; } = string.Empty;
        public string Observations { get; set; } = string.Empty;
        [JsonExtensionData]
        public Dictionary<string, decimal> TotalByPaymentTypes { get; set; } = new Dictionary<string, decimal>();
        public int OrdersQuantity { get; set; }
        public decimal Total { get; set; }
        public int State { get; set; } = 1;
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }
    }
}
