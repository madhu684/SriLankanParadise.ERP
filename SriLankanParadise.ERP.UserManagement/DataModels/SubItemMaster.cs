using System.Text.Json.Serialization;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SubItemMaster
{
    public int Id { get; set; }
    public int MainItemMasterId { get; set; }
    public int SubItemMasterId { get; set; }

    [JsonIgnore]
    public virtual ItemMaster ItemMaster { get; set; } 
}
