namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class AppointmentScheduleDto
    {
        public int Id { get; set; }
        public DateTime ScheduleDate { get; set; }
        public int? EmployeeId { get; set; }
        public int? SecondaryEmployeeId { get; set; }
        public int? DoctorEmployeeId { get; set; }
        public string CustomerName { get; set; }
        public string ContactNo { get; set; }
        public string FromTime { get; set; }
        public string ToTime { get; set; }
        public string ActualFromTime { get; set; }
        public string ActualToTime { get; set; }
        public string ActualFromTimeSecond { get; set; }
        public string ActualToTimeSecond { get; set; }
        public int EnteredBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime EnteredDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int TokenNo { get; set; }
        public int ChitNo { get; set; }
        public string Remarks { get; set; }
        public DateTime TokenIssueTime { get; set; }
        public int LocationId { get; set; }
        public int MainTreatmentArea { get; set; }
        public bool IsNeededToFollowUp { get; set; }
        public bool? IsPatientContacted { get; set; }
        public int? ParentAppointmentScheduleId { get; set; }

        // Navigation properties
        public EmployeeDto Employee { get; set; }
        public EmployeeDto SecondaryEmployee { get; set; }
        public EmployeeDto DoctorEmployee { get; set; }
        public EmployeeDto EnteredByEmployee { get; set; }
        public EmployeeDto UpdatedByEmployee { get; set; }
        public EmployeeDto DeletedByEmployee { get; set; }
        public AppointmentLocationDto Location { get; set; }
        public List<AppointmentTreatmentDto> AppointmentTreatments { get; set; }
        public List<AppointmentScheduleDto> ChildAppointments { get; set; }
    }

    public class EmployeeDto
    {
        public int Id { get; set; }
        public int ShiftMasterId { get; set; }
        public int EmploymentTypeId { get; set; }
        public int DesignationId { get; set; }
        public string FullName { get; set; }
        public string CallingName { get; set; }
        public string EmployeeNumber { get; set; }
        public string Address { get; set; }
        public string Nic { get; set; }
        public DateTime JoinedDate { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AppointmentLocationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int LocationTypeId { get; set; }
        public bool IsTreatmentLocation { get; set; }
    }

    public class AppointmentTreatmentDto
    {
        public int Id { get; set; }
        public int AppoinmentId { get; set; }
        public int TreatmentTypeId { get; set; }
        public TreatmentTypeDto TreatmentType { get; set; }
    }

    public class TreatmentTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DurationHours { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
        public string TreatmentShortCode { get; set; }
    }
}
