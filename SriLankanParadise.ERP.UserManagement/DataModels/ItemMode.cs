namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class ItemMode
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<ItemMaster> ItemMasters { get; set; } = new List<ItemMaster>();
    }
}
