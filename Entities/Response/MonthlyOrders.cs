namespace Entities.Response
{
    public class MonthlyOrders
    {
        public MonthYear Id { get; set; } = new();
        public int TotalOrders { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class MonthYear
    {
        public int Month { get; set; }
        public int Year { get; set; }
    }

    public class DailyOrders
    {
        public DayMonth Id { get; set; } = new();
        public int TotalOrders { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class DayMonth
    {
        public int Day { get; set; }
        public int Month { get; set; }
    }
}
