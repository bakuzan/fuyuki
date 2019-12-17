namespace Fuyuki.Data
{
    public abstract class BaseEntity<T> where T : BaseEntity<T>
    {
        public int Id { get; set; }
    }
}