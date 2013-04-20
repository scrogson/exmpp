#!/usr/bin/env escript
%% -*- erlang -*-

main([ Known_ELEMS_Src ]) ->
    io:format("% exmpp_known_elems.hrl.es~n"),
    Elements = lists:usort(read_elems(Known_ELEMS_Src)),
    io:format("-module(exmpp_known_elems).~n"
              "-export([elem_as_list/1]).~n~n", []),
    lists:foreach(fun (Ebin) ->
                          E = binary_to_list(Ebin),
                          io:format("elem_as_list('~s') -> \"~s\";~n", [E, E])
                  end, 
                  Elements),
    io:format("elem_as_list(undefined) -> \"\";~n", []),
    io:format("elem_as_list(A) when is_atom(A) -> atom_to_list(A);~n", []),
    io:format("elem_as_list(S) when is_list(S) -> S.~n~n", []),
    timer:sleep(10).

read_elems(Known_ELEMS_Src) ->
    {ok, File} = file:open(Known_ELEMS_Src, [read, binary]),
    read_elems(File, io:get_line(File, ""), []).

read_elems(File, eof, Acc) ->
    file:close(File),
    lists:reverse(Acc);
read_elems(File, << $#, _/binary >>, Acc) ->
    read_elems(File, io:get_line(File, ""), Acc);
read_elems(File, << $\n >>, Acc) ->
    read_elems(File, io:get_line(File, ""), Acc);
read_elems(File, EL_bin, Acc) when is_binary(EL_bin) ->
    Len = byte_size(EL_bin) - 1,
    << EL:Len/binary, _/binary >> = EL_bin,
    read_elems(File, io:get_line(File, ""),
	       [EL | Acc]).
