namespace Business.Interfaces
{
    public interface IRouteVerification
    {
        public bool VerifyStateOrderToDeleteOrUpdateRoute(string routeId);
    }
}
