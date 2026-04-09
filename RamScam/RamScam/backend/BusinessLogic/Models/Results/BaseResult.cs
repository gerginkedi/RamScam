namespace RamScam.backend.BusinessLogic.Models.Results
{
    public class BaseResult
    {
        public bool IsSuccessed { get; set; }
        public string Message { get; set; }
        public static BaseResult IsSuccess(string message = "transaction comleted succesfuly.")
        {
            return new BaseResult { IsSuccessed = true, Message = message };
        }
    }
}
