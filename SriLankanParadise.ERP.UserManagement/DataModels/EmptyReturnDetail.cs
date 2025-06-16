using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class EmptyReturnDetail
{
    //[Key]
    //[DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    public int EmptyReturnDetailId { get; set; }

    public int EmptyReturnMasterId { get; set; }

    public int ItemMasterId { get; set; }

    public int? BatchId { get; set; }

    public decimal ReturnQuantity { get; set; }

    // 🔗 Navigation Properties
    public virtual EmptyReturnMaster EmptyReturnMaster { get; set; } = null!;
    public virtual ItemMaster ItemMaster { get; set; } = null!;
}
