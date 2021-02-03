using System;
using System.Collections.Generic;
using System.Linq;
using Fuyuki.Attributes;

namespace WS.Newquay.Core.Extensions
{
    public static class EnumExtensions
    {
        public static string GetEnumStringValue(this Enum enumValue)
        {
            var type = enumValue.GetType();
            var fieldInfo = type.GetField(enumValue.ToString());

            StringValueAttribute[] attribs = fieldInfo.GetCustomAttributes(
                typeof(StringValueAttribute), false) as StringValueAttribute[];

            // Return the first if there was a match.
            return attribs.Length > 0 ? attribs[0].StringValue : null;
        }

        public static List<T> GetEnumValuesAsList<T>(this Type enumType)
        {
            if (enumType.IsEnum)
            {
                return Enum.GetValues(enumType).Cast<T>().ToList();

            }

            return null;
        }
    }
}
