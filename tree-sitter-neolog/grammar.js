module.exports = grammar({
    name: 'neolog',

    rules: {
        facts: $ => repeat($.clause),

        query: $ => seq($.disj_predicates, '.'),

        clause: $ => seq(
            $.predicate,
            optional(seq(':-', $.disj_predicates)),
            '.'
        ),

        disj_predicates: $ => prec.right(choice(
            $._disj_predicates,
            seq('(', $._disj_predicates, ')')
        )),

        _disj_predicates: $ => seq(
            $.conj_predicates,
            repeat(seq(';', $.conj_predicates))
        ),

        conj_predicates: $ => prec.right(choice(
            $._conj_predicates,
            seq('(', $._conj_predicates, ')')
        )),

        _conj_predicates: $ => seq(
            $._term,
            repeat(seq(',', $._term))
        ),

        _term: $ => prec(10, choice(
            seq('(', $._term, ')'),
            $.variable,
            prec(2, $.atom),
            prec(1, $.predicate)
        )),

        variable: $ => /[A-Z][A-Za-z0-9_]*/,

        atom: $ => /[a-z][A-Za-z0-9_]*/,

        predicate: $ => seq(
            field('name', $.atom),
            '(',
            field('args', $.args),
            ')'
        ),

        args: $ => seq(
            $._term,
            repeat(seq(',', $._term))
        )
    }
});
