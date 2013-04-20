#!/usr/bin/env escript
%% -*- mode: erlang -*-

main([ Known_ATTRS_Src ]) ->
    io:format("% exmpp_known_attrs.hrl.es~n"),
    Attributes = lists:usort(read_attrs(Known_ATTRS_Src)),
    io:format("-module(exmpp_known_attrs).~n"
              "-export([attr_as_list/1]).~n~n", []),
    lists:foreach(fun (Abin) ->
                          A = binary_to_list(Abin),
                          io:format("attr_as_list('~s') -> \"~s\";~n", [A, A])
                  end, 
                  Attributes),
    io:format("attr_as_list(undefined) -> \"\";~n", []),
    io:format("attr_as_list(A) when is_atom(A) -> atom_to_list(A);~n", []),
    io:format("attr_as_list(S) when is_list(S) -> S.~n~n", []),
    timer:sleep(10).

read_attrs(Known_ATTRS_Src) ->
    {ok, File} = file:open(Known_ATTRS_Src, [read, binary]),
    read_attrs(File, io:get_line(File, ""), []).

read_attrs(File, eof, Acc) ->
    file:close(File),
    lists:reverse(Acc);
read_attrs(File, << $#, _/binary >>, Acc) ->
    read_attrs(File, io:get_line(File, ""), Acc);
read_attrs(File, << $\n >>, Acc) ->
    read_attrs(File, io:get_line(File, ""), Acc);
read_attrs(File, ATTR_bin, Acc) when is_binary(ATTR_bin) ->
    Len = byte_size(ATTR_bin) - 1,
    << ATTR:Len/binary, _/binary >> = ATTR_bin,
    read_attrs(File, io:get_line(File, ""),
	       [ATTR | Acc]).
