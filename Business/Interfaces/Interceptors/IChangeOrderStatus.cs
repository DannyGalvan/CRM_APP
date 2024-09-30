using Entities.Request;

namespace Business.Interfaces.Interceptors
{
    public interface IChangeOrderStatus
    {
        public bool ExecuteChange(List<ChangeOrderStatusRequest> orders);
    }
}
