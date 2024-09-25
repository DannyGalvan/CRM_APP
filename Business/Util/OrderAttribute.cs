namespace Business.Util
{
    [AttributeUsage(AttributeTargets.Class)]
    public class OrderAttribute(int priority) : Attribute
    {
        public int Priority { get; } = priority;
    }
}
