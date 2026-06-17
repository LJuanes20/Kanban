using System.ComponentModel.DataAnnotations;

namespace TDAPI.Models.Dtos.Tasks
{
    public record UpdateTaskStatusRequest([Required, Range(1, 4)] int StatusId);    
}
