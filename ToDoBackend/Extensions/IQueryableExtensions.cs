﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ToDoBackend.Core.Models;

namespace ToDoBackend.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<ToDo> ApplyFiltering(this IQueryable<ToDo> query, ToDoQuery queryObj)
        {
            if (queryObj.PriorityId.HasValue)
                query = query.Where(v => v.Priority.Id == queryObj.PriorityId.Value);

            if (!string.IsNullOrEmpty(queryObj.Name))
                query = query.Where(v => v.Name.Contains(queryObj.Name));

            return query;
        }

        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, IQueryObject queryObj, Dictionary<string, Expression<Func<T, object>>> columnsMap)
        {
            if (String.IsNullOrWhiteSpace(queryObj.SortBy) || !columnsMap.ContainsKey(queryObj.SortBy))
                return query;

            if (queryObj.IsSortAscending)
                return query.OrderBy(columnsMap[queryObj.SortBy]);
            else
                return query.OrderByDescending(columnsMap[queryObj.SortBy]);
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObj)
        {
            if (queryObj.Page <= 0)
                queryObj.Page = 1;

            if (queryObj.PageSize <= 0)
                queryObj.PageSize = 10;

            return query.Skip((queryObj.Page - 1) * queryObj.PageSize).Take(queryObj.PageSize);
        }
    }
}
