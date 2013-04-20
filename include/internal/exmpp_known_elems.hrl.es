#!/usr/bin/env escript
%% -*- erlang -*-

main([ Known_ELEMS_Src ]) ->
    io:format("% exmpp_known_elems.hrl.es~n"),
    Elements = lists:usort(read_elems(Known_ELEMS_Src)),
    io:format("-define(XMPP_KNOWN_ELEMS,~n"
              "        ~p).~n~n",
              [ [ binary_to_list(EL)
                  || EL <- Elements ] ]),
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
