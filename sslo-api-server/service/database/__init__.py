

from pypika import MySQLQuery as Query, Table, Field, Parameter, Criterion, Case, Order
from pypika import functions as fn, CustomFunction
from pypika.queries import QueryBuilder

from pypika.terms import Function
from pypika.functions import DistinctOptionFunction
from pypika import Field, MySQLQuery, Order

from pymysql.err import IntegrityError

QUOTE_CHAR = MySQLQuery._builder().QUOTE_CHAR

class GroupConcat(DistinctOptionFunction):
    def __init__(self, term: Field, order=Order.asc, sep=",", alias=None):
        super().__init__("GROUP_CONCAT", term, alias=alias)
        self.term_ = term.get_sql(with_alias=False, quote_char=QUOTE_CHAR)
        self.order = order
        self.sep = self.wrap_constant(sep)

class Distinct(DistinctOptionFunction):
    def __init__(self, term: Field, order=Order.asc, sep=",", alias=None):
        super().__init__("DISTINCT", term, alias=alias)
        self.term_ = term.get_sql(with_alias=False, quote_char=QUOTE_CHAR)
        self.order = order
        self.sep = self.wrap_constant(sep)

    # def get_special_params_sql(self, **kwargs):
    #     return f"ORDER BY {self.term_} {self.order.value} SEPARATOR {self.sep}"
