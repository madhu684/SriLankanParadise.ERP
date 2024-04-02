using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SupplierAttachment
{
    public int SupplierAttachmentId { get; set; }

    public int? SupplierId { get; set; }

    public string? AttachmentPath { get; set; }

    public virtual Supplier? Supplier { get; set; }
}
