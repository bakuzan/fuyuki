using AutoMapper;
using Reddit.Controllers.Structures;

namespace Fuyuki.Mapping
{
    public class AwardsConverter : ITypeConverter<Reddit.Things.Comment, Awards>
    {
        public Awards Convert(Reddit.Things.Comment source, Awards destination, ResolutionContext context)
        {
            return new Awards(source);
        }
    }
}