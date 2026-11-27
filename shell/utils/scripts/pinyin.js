.pragma library

// JECH-style universal Chinese Pinyin search engine (full pinyin, initials,
// syllable prefixes, polyphones, and mixed Hanzi/ASCII matching).
//
// Pinyin dictionary (20,882/20,992 U+4E00..U+9FFF characters, 1,344 polyphones)
// compiled from Rime pinyin_simp (derived from Android PinyinIME, Apache-2.0)
// and Rime luna_pinyin (LGPL-3.0), both compatible with GPL-3.0-or-later.

var _BASE = 0x4E00;
var _END = 0x9FFF;
var _ALPHA = "#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
var _SETS = ["","yi","ding,zheng","kao,qiao","qi","shang","xia","wan,mo","zhang","san","ji","bu,dun","yu","mian","gai","chou","zhuan","qie,ju","pi","shi","qiu","bing","ye","cong","dong","si","cheng","diu","liang","you","yan","sang","e,shu,gun","jiu","ge","ya","jiang,kan,pan","zhong","jie","feng","kuang","chuan","chan","lin","zhuo","dian,tao,zhu","ba","wan","dan","wei","zhu","jing","li","ju","pie,yu","fu,pie","nai","wu","zhe,tuo","me,ma,mo,yao","yi,cha","zhi","zha","hu","fa","le,yue","ping","pang","qiao","guai","sheng","cheng,sheng","ya,yin","zhe","mie,nie","xi","xiang","shu","nang","mao","mai","luan","zi","ru","xue","fu","sha","na","gan,qian","qian,gan","gui","jue","le,liao","zheng","er","chu","kui","yun","sui","gen","geng","xie","ji,qi","wen","wang,wu","kang","da,dai","jiao","hai","heng","mu","ting","qin,qing,zhen,xin","bo","lian","duo","men","ren","ren,dan","shen,shi","le","ding","ze","jin,fu","pu","chou,qiu","jin","bing,ning","reng","fo","lun","cang","zai,zi","ta","xian","cha","hong","tong","qian","gan","ge,yi","dai","ling","chao,miao","chang,zhang","sa","fan","yang","wo","jian","jia,jie","yao","wang","fen","di","fang","pei","diao","dun","xin","ai","xiu","yin","shen","nu,tang","huo","hui,kuai","zu","chuan,zhuan","che","chang","cang,chen","xun","nu","bo,bai","gu","ni","ban","xu","zhou","si,ci","beng","si,shi","ga,jia,qie","leng,zheng","dian,tian","gan,han","bu","qu","bi","zhao","ci","zuo","ti","zhan","he","tuo","she","fo,fu","gou","ning","yong","wa","ka","bao","hui","lao","bai","ming","jia","er,nai","quan","tiao","xing","kan","lai","chi","kua","guang","an,yin","mi","an","lu","mou","dong,tong","gong","lv","jiao,yao","zhen","ce,zhai,ze","kuai","chai","nong","hou","jun","cheng,ting","hao","qin","dou,shu","nan","xiao","bian,pian","tui","cu","e","shu,xu","ku","hun","ying","su","shu,yu","si,qi","lia,liang","pai","biao","chu,ti","fei","bei","yu,zhu","zong","guan","tian","dao","tan","zhui","tang,chang","jing,liang","jie,qie","kong","juan","luo","song","ben","cai","zhai","qing","qie","ru,ruan","chun","ji,jie","ruo","pian","dang,tang","huang","zou","cai,si","duan","ce","ou","tou","zan","lou,lv","sou","yuan","rong","jiang","ma","bang","dian","tang","shan","chen","suo","zai","bin","nuo","can","lei","cui","zao","peng","ao","chuang","han","piao","man","zun","jiong","liao","cheng,deng","chuan,chun","tie","seng","e,wu","tong,zhuang","min","sai","dang","xuan","tai","lan","meng","qiong","lie","qin,zhen","teng","long","hui,xi","er,ren","xiong","chong","rui,dui","ke","dui","tu","dou","nei","liu,lu","qi,ji","zi,ci","shou","ran","gang","gua,guo","mao,mo","mi,mu","kou","leng","pan","qia","fu,mei","zhun","cou","du","ji,ju","kai","gan,jian","deng","kan,qu","tu,gu","ao,wa","zao,zuo","dao,li","cun","hua,huai","yue","liu","bie","pao,bao","gua","shua","quan,xuan","sha,cha","dou,lou","cuo","xiao,xue","ke,kei","la","pou,pao","bo,bao","lve","shan,yan","jiao,chao","hua","mo","keng","shao","miao","jin,jing","kei","gao","lang","pou","le,lei","qiang","rang","bao,kui","bao,wen","tao","pao","da","gong,ju","nao","shi,chi","fang,xi","za","cang,zang","hu,wu","kui,gui","suan","qu,ou","bian","nian","zu,cu","dan,shan,chan","chi,ji","lv,shuai","bu,bo","gong,guan","ka,qia","dan,jie","que","chang,an,han","wei,yan","jie,zhe","an,han","mang","zui","xia,sha","jin,qin","lan,qian","you,gong","lin,mian","rou","diu,du","xian,xuan","can,shen,cen","can,shen","can,cen","shuang","guai,jue","re,ruo","jia,xia","die,da","rui","guo,kua","dao,tao","zhao,shao","tai,yi,si","qiu,rou","po","ye,xie","xiang,yang","yu,xu,a","lin,song","he,ge","xia,he","a,ya","tun","ge,xie","fou","dun,tun","ting,yin,yi","keng,hang","shun","zhi,zi","chao","ne,na","chui","dai,ai","na,ne","m,mu","dai,tai","bei,bai","guo","chi,tai","pen","ne,ni","m","gu,gua","he,a","zui,ju","xian,gan","za,zha,ze","he,huo,hu","ga,ka,jia","die,xi","mie","lo,luo,ge,ka","zan,za","hai,ke","wai","yan,ye","pin","ha","yo","o,e","na,ne,nei","mie,xiang","shuo,yue","chun,zhen","wu,en,n,ng,mu","huan","hu,xia","nian,dian","zhao,zhou","nou","ken","di,shi","a","wa,ye","chuo,chuai","qing,ying","pa,pia","se","nie","jue,quan","yong,yu","die,zha","nuo,re","wo,o","he,ye","fen,pen","sun","zha,cha","lou","ai,yi","da,ta","gu,wa","weng","hai,hei","en,n,ng","dia","zhe,zhu","can,san","cao","ai,yai","ga","gu,jia","dai,de","lei,le","zuo,chuai","chao,zhao","gao,hao","chu,shou","hei,hai","ceng","o,ou","jue,xue,ju","hm","huo,o","shou,zhou","me","cha,ca","hu,yo","qi,xiao","jiao,jue","chuo","zen","e,nie","lo","wei,guo","nin","nan,jian","tuan","tun,dun","kun","qun","mi,ri","quan,juan","yuan,huan","sheng,ku","wei,xu","di,de","xuan,xun","fen,mei","huai,pei,pi","jing,xing","de,di","chi,di","zhi,zhuo","ba,fa","dui,zui","die","ken,yin","hang","bei,ba","beng,feng","mai,man","pu,bu","di,ti","sao","bao,pu,bu","bao,pu","ruan","mei","jiang,xiang","su,suo","sai,se","zang","kan,xian","ji,xi","zeng","ba,fei","gao,que","bi,pi","huai","zhuang","ke,qiao","dong,zhong,yin,zhe","bei,yuan","hang,ben","tao,yan","jia,ga","pa","di,en","fen,gang,ben","qi,xie","zang,zhuang","ben,bo","sui,xiao","ha,po","nv","nuan","shuo","fu,you","pei,pi","niu","gang,gong","rao","niang","na,nuo","bin,pin","fu,wu","zhui,zhuo","jing,qian","an,yan","hun,kun","qin,qing","niao","bang,pang","bao,biao","ce,ze","nen","nen,nun","pie","gui,wei","wei,wo","an,xian","can,qian","gui,jiao","juan,quan","gong,jue","ma,zi","bei,bo","ni,zhuan","can,chan","bi,bo","ning,zhu","jia,tu","wan,yuan","xian,xiong,hun,mao","bao,shi","kuan","su,xiu","jing,qing","xun,xin","le,luo","wei,yu","ma,me","chi,che","kao","wei,yi","niao,sui","ping,bing","shu,zhu","die,xie","tun,zhun","ni,po","ang","cen","ze,zuo","en","zhi,shi","qiao,jiao","xie,ye","leng,ling","jue,ku","wai,wei","qian,kan","mao,wu","qi,xi","jiao,qiao","shan,zhan","jie,za","li,lie","cuan","chuan,shun","cha,chai,ci","xiang,hang","sun,xun","po,fu","shuai","tang,nu","shui","jun,qun","chou,dao","qie,sha","kai,yi","bing,ping","cong,zhong","zhuang,chuang","dao,chou","jian,qian","guang,an,yan","zhuang,peng","du,duo","bei,bi","kuo","jue,yin","gong,nian","kai,jian,qian","nong,long","sa,san","jiang,qi","shen,yin","tan,dan","qiang,jiang","she,ye","heng,huang","san,shan,xian,qu","chi,li","pang,fang","hen","huai,hui","cheng,zheng","bu,zhi","de,dei","biao,piao","de","zhi,zheng","chan,qian","te","tei,te,tui","lie,xi","shi,tai","nin,ren","huai,fu","zen,ze","fei,fu","nen,ren","sai,si","hu,kua","gun","xu,yu","han,he","chang,tang","re","ke,que","nuo,ru","qian,qie","cheng,tang","dui,dun","nao,nong","ai,ni","lan,xian","mi,mo","gang,zhuang","zhuang,gang","xi,hu","ai,e","jiong,shang","shou,ti","zha,za","pu,po","ba,pa","kang,gang","den","rao,you","ne","zhua","zhe,she","ao,niu","mo,ma","zha,zhan","chai,ca,che","tuo,ta","pin,pan","di,zhi","ze,zhai","kuo,gua","shuan","za,zan","zhuai,ye","long,neng","zhua,wo","sa,sha","suo,sa,sha","bang,beng","lv,luo","shu,song","zhuai","shui,tuo","bai,bi","wo,xia","lue","guo,guai","dan,shan","ni,nuo","ti,di","zuan","chuai","she,tie","nang,rong","bang,peng","nou,nu","nai,zhi","she,nie","chan,sun","di,tu","cha,qi","song,sou","chu,hu","chuang,qiang","jiang,qiang","keng,qian","jiang,jing","qian,zan","can,cao","tan,dan,shan","sou,xiao","cuo,zuo","xi,xie","bo,bai,bi","ca","la,lai","zan,cuan","cuan,zan","shai","si,yi","ce,chi","chen,zhen","dun,dui","shu,shuo","ai,zhu","yu,wu","pang,bang","chi,zhi","dan,zhan","ri","pei,po","die,yi","xuan,yuan","nie,xie","da,die","ceng,zeng","pu,piao,po","ji,wei","za,duo","quan,shu","shan,sha","biao,shao","si,xi","chou,niu","cong,zong","gou,ju","duo,tuo","bai,bo","mao,mou","gui,ju","zha,zuo","cha,zha","cheng,jue","shan,zha","yue,li","ben,bing","xiao,jiao","he,hu","ju,jie","gui,hui","sha,suo","zhou,zhuo","sen","zhui,chui","san,sen","shen,zhen","dun,shun","zou,cou","kai,jie","kan,jian","bin,bing","gui,ji","gai,kai","kang,liang","mo,mu","di,tiao","fa,fei","run","sha,shan","bing,bin","chun,tun","guang,guo","cha,sa","han,qian","chua,xu","chua,dan","she,xi","du,yi","dai,e","die,ye","hui,kui","yin,yan","keng,qing","qiao,ke,que","tan,zhan","shi,zhi","mang,meng","shui,san","ni,niao","gui,jiu","han,nv","tang,shang","gu,mi","cen,gan","shen,chen","mu,shu","niu,nv","ta,da,miao","mei,mo","li,yi","bo,po","mi,bi","jiao,zhuo","long,shuang","luo,po","ye,yi","xi,xian","qian,jian","hu,xu","jun,xun","wo,guo","ji,qie","xiao,yao","gu,yu","mian,sheng","yan,yun","jiao,qiu","jiao,jiu","yan,yin","kui,hui","ying,xing","qi,qu","luo,ta","chong,chuang","shu,sou","liao,lao","hei","dan,tan","pu,bao","huo,biao","deng,ding","dao,qie","gui,jiong","geng,guang","duo,ta","chu,zhuo","lao,luo","xie,zhe","kao,ku","xi,yi","jun,qu","tao,dao","chao,zhuo","chang,gua","nuan,xuan","bao,bo","nai,xiong","lian,qian","shu,shou","cui,sui","yu,yun","jiu,zhi","wei,yue","liao,liu","yao,yue","che,ta","zhua,zhao","zhao,zhua","bian,mian","mou,mu","quan,fan","mi,xian","lie,que,xi,ji","luo,guo","ben,fen","jiu,qiu","wen,min","bin,fen","gen,yin","hui,hun","min,wen","zuo,zhuo","jue,yu","ju,qu","you,zha","ding,ting","chu,xu","gai,hai","fan,pan","fu,pi","shu,pi,ya","chuang,ne","nue,yao,nve","ni,nie","bi,bei","e,ya","chai,cuo","nue,nve,yao","neng,nong","bin,lin","lvan","gai,he","gai,ge","sheng,cheng","an,kan","sheng,xing","ju,kou","mai,mo","zhe,zhao,zhuo","qiong,yuan","han,xuan","kou,ou","run,shun","jin,guan,qin","guan,jin","shi,dan","qi,qie","hua,xu","kang,keng","guang,kuang","peng,ping","tong,yong","nve","su,xie","bang,pang,beng","sun,yuan","chui,dui","jian,xian","huo,ke","jie,xie","bao,pao","wu,yu","chan,shan","zhong,chong","geng,jing","cheng,chen","ge,he","ji,jia","lian,xian","jiu,zi","chen,cheng","xun,yin","ke,zhao","chu,duo","gu,ku","ce,chai","jun,yun","o","fu,pou","cang,qiang","sen,shen","ju,yu","mi,nie","chao,sha","nian,zhan","shen,san","tang,xing","zhong,zong","mi,mei","chi,xi","xi,ji","za,zha","geng,heng","gei","xie,xu","lun,guan","chuo,chao","cheng,zhen","tao,tiao","fan,po","miu,miao","yao,you,zhou","xu,xuan","gang,jiang","zao,qiao,sao","li,yao","lei,luo","hong,gong","qian,xian","yue,yao","gei,ji","luo,lao","chao,chuo","zeng,zong","lv,lu","suo,su","miu,miao,mou","qiao,sao","xie,yu","fou,gang","kun,ti","xian,yi","kong,qiang","he,xi","zhai,di","die,lao","pa,ba","ze,zha","hu,huo","ying,yun","dan,ran","tui,wa","ji,ni","ken,keng","chi,yi","rong,chen","pang,pan","ke,qia","neng","gui,kui","fu,pu","la,xi","a,yan,ang","er,nao","biao,lu","sheng,ying","teng,tun","sui,wei","cui,zui","qian,qin","zang,cang","chou,xiu","dan,xian","cao,zao","se,shai","jie,gai","lu,hu","yan,yuan","hua,lun","shao,tiao","jia,qie","qian,xi","chai,zhi","jian,chong","jiao,niao","yi,ti","qian,xun","xin,shen","guan,wan","fu,piao","nian,ren","yan,yu","luo,la,lao","ye,she","zhu,zhuo,zhe,zhao","ren,shen","xun,hun","feng,lan","chun,zhuan","mi,ming","man,wan","chu,zhu","yun,wen","ti,zhi","pin,ping","jie,ji","wen,yun","han,lan","nue,nve","she,yi","hong,jiang","xia,ha","bang,fang","can,tian","ran,tian","he,ke","ha,ge","shao,xiao","han,xian","la,zha,qu","na,rui","xie,he","qiu,you","zhe,shi","zei","chuo,he","xue,xie","xing,hang","shuai,cui","xia,xie","chi,duo","hui,kun","shang,chang","xi,ti","qi,yi","ken,tui","cha,suo","tui,tun","nie,yi","juan,zhuan","cui,cuo","bo,fan","qin,tan,xun","fiao","guan,huan","mian,tian","qu,xu","jue,jiao","zui,zi","chu,hong","jue,lu","juan,jun","cha,chai","shen,xin","tian,xian","na,nao","mei,mi","chi,er","yi,eh,ei","chu,qu","tiao,diao","jie,ze","qian,yan","gua,hua","dui,gui","yi,shi","miu","can,chen","hua,hui","di,zhe","guo,xi","xu,hu","shuo,shui,yue","e,ei","du,dou","shui,shei","xia,ya","jian,yan","bo,mo","ge,hao","he,hao","yuan,yun","bi,ben","zhuan,zuan","ben,bi","jia,gu","ju,qie","chen,shen","fu,qu","li,luo","gua,tuo","nian,ran","dun,cun","zha,ya,ga","zhan,nian","che,ju","hai,huan","zhe,zhei","po,pai","shi,kuo","beng,bing","yi,wei","yao,you","na,nei","huan,xun","fu,nuo","dou,du","qiao,xiao","zuo,cu","fu,zui","shai,shi","shi,li","lan,luan","bu,pi","tian,dian","cu,zu","she,ta","ta,tuo","ni,xi","nie,xi","tong,zhuo","jian,xing","yao,diao","gua,tian","gong,kuang","pei,pou","zu,zui","she,shi","nuo,tian","qiao,qiu","yao,zu","hao,gao","chan,jian","ti,zan","dang,cheng","diao,yao","mi,mie","zuo,zao","dou,tou","hong,xiang","xian,kan,han","he,jie","du,she","kan,han","dou,tu","bei,pei","dian,yan","a,e","bei,pi,po","lu,liu","xia,shan","bu,pu","tao,yao","wei,kui","jun,juan","que,qiao","fou,fu","se,xi","lian,ling","lu,lou","liang,jing","ge,ji","qiao,shao","guo,kuo","eng","hai,xie","dun,du","dan,dian","qin,he","jing,geng","cong,xin","chan,zhan","biao,xiu","shi,si","tou,zhu","hao,tao","tie,zhen","he,jia","bing,guo","ai,he","ai,hai","tuo,duo","jin,xin","long,zang","bo,jue","bian,piao,biao,shan","ge,li","gui,xi","ga,jie","po,bo,tuo","lin,ling","ba,bo","chou,diao","chou,you","shan,shen","huan,wan","fang,pang","e,ge","qiu,xiu","rong,yong","gui,jue","la,lie","ao,yao","ju,jue","ju,sui","ti,yi","jun,zun","hu,gu","jin,qian","jun,kun","ci,zi","hao,he","niao,diao","gu,hu","pao,piao","me,mo","me,mo,ma","nun","hua,xi","ya,yao","cu,cuo","yin,ken","gui,jun,qiu"];
var _DATA = "#$#%#&#(#)#*###+#,#-#)#*#.#/#0#1#2#3#3#4#5#6#7#7#8#9#:#;#<#=#>#?#8#@#?#A#@#B#9#C#D#E#F#G#H#I#.#J#K#L#M#N#O#P#Q#R#S#T#U#V#W#X#Y#Z#[#$#$#]#^#E#E#_#`#a###b#^#c#d#e#f#I#g#h#i#d#j#k#l#$#m#n#o#E#(#:#p#q#2#E#####r###7#.#s###Y#7#t#d#u#v#w#x#y#B#z#{#|#}###0###n#~#b$##}#v#O#$$$$%#F#0$&#b#7$($)#0$*#0$+#d#(#^#W#=$,$-$.#G$/#G$0#G$0$1$2$3$4$5$6#$#N$7$8###q#W$9#@#q#W#:$:$;#A$/#T$<$=$>$?$@#.#.$2#$$A$?$B$C$D$E$F$G#R#,$H#J$I$J#;$K#-$L##$M$N#7$O#,#z$P$P$Q$R$S$?$T$U$V#P$W$X#$$Y$Z$[#)#$$8$>$?$]$Y$^$T#I#6$_#^$`$a$b#K$M$?$c$d$e$f#I#($g#0$h$i$1#$$j$3#$#.$k#^#.#z#e$l$m#6$n#z$o#I#A$p$q#0$r$+#-#U$s$t#G$P#)$u$L$v$w$j#U#V$D$P$x$y$z${${$/$|$}$X$~$n$r%#%$%%%&#6#$#=#$%(%)%*#u#T#V%+%,%-%.%/#U$e#V%0#A$^%1%2%3%-%4%5#0#$%6%0%7%8$S${$P%,%9%:$T#7%;%<$g%=%3%>#q#F$^%?#e%@%A%B#9#.$7$p$#%C%D$5%/#$#7%E$n%4%F#b$6%G#$%H%I%J#X%K#7%L#V$}#A%M%N%O$($L%P$Q%H$w%Q$~#$#x$`#*#=$W%R$O%S%T%U#i%V%W%8%X$H#^%Y%Z%[%T%0%]%^%R#Y%_$9$n%4$;%`%a%b%c#0#p%d%e#8%f%J%g#^%Z#$#z#@$r#i#X%9%h%i$P#-$g%j#z#p#X#1#g%<%k%l#*$j$l#0$e#Y#3#b#B%m#X%G#=$`$l#z$p#Y%a%n$`%o%p%q#K#G%M%r%s$j%-#d$&#b#9#E$b$r%m#S%G$M%t#F%u%r%v#r#r$>%w%x$$%y%E#g%z%Y#$#(%1$U%{#J$,$u%|$f#b%}%~%t#Y$T${$L#P$_&#&$$X%h#<#w&%#^#Y#]&&$`&(#:#b#{&)&*%i#>$`#B&+$S&,%A&-#U#0#9&.%1#U&/#B#K&0$_%e$/$t#k%F$e%0$Q$9%r#c&1$b%2&2#B#A$`$}#c%/#z#z#b%t#1#.#$$/$w&3&4&5%T&6&7&7%r&8&9#J#U$d$u$*&:#b%j#*#z&;&<#X#x$+&=&>&?&@&A%]#J#p&B$T$$&C$)#-%r%a%9$b%x&D$^#e#9%A$W&E&A$z&F$)&G&H&I&J%9&K%t&L&$&M$s#0&($r#)&N#W%H#{&O#,&)$m$e$/&9%r&P$H$<%N&Q$T$P%x%i#<&R#q&B#i&S%c&R$F#p%>$u%J&T#(&U#4#U#.$;%=&V&W&B%S#E&X$d$P#0&Y$5$`&Z#O$;$z$P%j$P&=&[#:$H%A#i#6#K$~$k&]#$%Z%X%x#$&^#W&_%V$`$)#T$5#{&E&H&F%M#x&`%w%W&a#$$H$T&b#^%8&c$($u&d&I%R#L%<#0%o&8#b#=#A%]&e%^#X&f#U&g$)#N#q%D&h#X&#&8&G&A#B&##s&i#^$+&8&;&j&k%.&j$P%J&l&m&n#1&o$Z${&n$($H&o#=#B#B#7#7&^$T&p$d#t$n&p%?#W#X&1#x$2&q%C#@#0#R%Q&r#p&O&a%Q%v%u%E#9&s#Y&@&t$d$^$`&u#.#$#.#N&S#t&v&q#B#t&w&v&5%=&5&E&x&S#t$~&y%7$}#1&z&<#A$/%F%Z%X#$%L#7%u&b#I#Y&;%@&{#O#z$/%L#9#<&`&w#K#9#d&k$$#d#L#:&|&}#z&[#<$P&d&~$`#W&:(#&o#($z($&$#W#@&)$h$X#<$U$`$m(%$k#X$M%@($&J#=$=$H#O#O%8#p(&#.$]$]$]#K(($)$&#K$8#b#z#K#g#K()&1()(*(+#g(,&j%V(-(.$)#.&^&O&O(/%w$h(0$?$?&N$d&*#$#.%F$T(1$)$1$##T%E(2#S$$#X(3&d(4$D&w&N#z$)%,$h&B&[$X#I&}(5#J#J(6#X&B(5#N#W(7$.%w&N$*%g$=$(#b(8(9(:%/&m#J$#%/$#()$=#.%1#W(;&#$D&;(<(=(>(?$T(:&N(7$`(<#X%1%q(@#N#(&N#w&w#S(A#.$=(B(C#P$`#.(A#B#Y$p#k$`$=#b#^(7#z#k$`#F#c()&N%~#N#4%N#X&L&B&P&{(D(7#i$$(E#c#P$<#Y#6(4$#$5$#$`$`&A$p#.$`#$$`#b#N$`(F#X#V#X#G%C$|%Q%A#^#u&d#W(G$/#b#<#V$x#J%,(H#$#V(I#X(J%>%>%~&{$^%:%a%O#L#J&d%3#7(K(J(L$;&[%H(M%9%9#1&m$w%C&)%N(N&b%H(O()#1#<$}$}%F#^#$$w$^#k%>$8%N&P#7#.%^(P$5%C#q#$$$$]%~%P#Y#T$/#u$w$w%R#X$t(Q%C(R(H$+#E(S%7#^$+##%-(7#2%<#;#$&j&L#Y(T#F$F%e(U#z%Q(V#E(W%-(E%r(X(Y(Z#E#$([&=$3&=#L#d#*%,$]$#&*(]#L%q(^#0$#(_%=#T(_$<$<(`(&#E%,#p#6(a#$&m#B(b${%,#7$w$T(c$[$r#k#^%=$|#7#p#S(E$/#S%r(d#P$/(e#u%`&B(f$;(g(h(i(b%+%2(j%N#A%N#p(7$_$/(k#J#U$^&c#b#t$m#U(H#.(l#v%H%~$/$}$H(l$*#.%e&)#p#-(m(n%e$9#X(o(p#X#G#G#B%5$e&(#h#G&*#G#b&5(q%1#X%5%Y$9(r(<%q&;$D&;#q#B#X$$(s&@$)#E(t&M$##B#=#X$u(u#X#B#B&;#=(v(w(x%,%,##&I(y(z#4#-({(|#-(}$k$W#A$Q#.#A(~$]&u)#$;#e)$#7#r#P%,&u(b$})%&}&:#.#U&:)&)(#;&{$z#Y$X)))*&{#b$5)+#R$C&m),%H#7#A)-).)/%]#=%x%H$B$h#.&T$R)0)1(q%H#F)2$b#.)3#.$h(1$S%@%Y#X&o#q#c)4#:%R)5&>&6$p#p%Z#3#O)6$m%q%-%^%^)7%+)8#R)9$d(E&O):);)<#($R)=$m#^#^)>)?#y#p)@&p$1%Y$R#^(L#G%Z%R%e#F$1)A#(#>#^(L#z$5%Y%H#k)B)6)C#$)D&6#X)E&;)F#((P#^%e)G%~)H$1)I)J$X&v#A$e$~#7$~&W#p#$#(#g#w)K#w#U$})L(X#*$g%H%a$n#d%@#G%,)M)N([%4$=(N(U(5#z$^$p)O)P&`#E%9#z(V$~%:%;$z)Q%0%+&g#<%8$O#=$P$p#($(%e%J#c)R#$&d#w)S%L#b$b#.$~)T$w)U%a)V%=%I#7%D$P%e&_$l)W)X%>#$$k)Y$n$S$R&j$=%:)Z&E#0$e%n#q$k$-#L#G(V%a%-(3(c(E%E%V$=$d&(%X%O)[%]&;&g(N(q#F)]%H(H#X)^$r%3%g%a$P%>).#n#c(M#R)_%R$,#z%+&O$7$.)`#F#A#B$z$z)E&O&D)a#$$k$T&o#B#S#X#p&A%0#8$t)b&K#G&p#($e%^#u(F%Q&p%,%>#@&D&K)c(M#{#.%0$_#K$H)d#(&u#U(8$u%:#X(P%M#J)[)e#0$P%G#{#p%4#d$k)f)g)h#P#P#))i$7#O)j%a#q($#^$1&J%1$z#(#((T#T#T)k#w%-&J)l%3#G#(#n%q#@$P#6#{(?$D)m(7)n#n)o#4)p)F&##B$e)q#N$;$C(M%a#Y&A%H%1%M#E#T%;)r#U%`&B#0#n(?#J%Y&O)s$~%W)W)t#0$m&8$b)u#1#d$+#M%=)c)c#p)v#.$*#I#U#{$}&1#c#B&_#@#0#C%H#i#B#T)w)x#X)[)y#U(I%i)H%+$*#p#0#J)z%g&K$p%1$b%a)j$l(P)o%9%j$R$/){&D&>$Q$6&m)|#C&C#x&:)}#.#h#^$T#7#F#w#J&#)~%:#=%H%]&D##*#&D%^)p%3#b&]*$#F#|*%$k(P$S%-&M&M$<(r*&(F&:&:%x$e#($5&k$5#F%x*(*)%A**%a&P)z*+*,%a#d%=)F&6$P$D$u$}).*-&>&>#d*.(&*+&A#:%$%i&]$5%L%a(E#u&v*/&L%>%a#.#V*0$*(r%a#=*1)J&T#i#p*2%4%x*3$w%e&R$]%H%=&8&N([#T#0)6*4$5#:#p#(*1%x$}(+%=$m$F$$%^$w$b%N#=#B%i(V%2*5#P$H%X(3$/#(%e&K#$#7#i&;$k%9*6#U#0)H%w*+*7$i&^$j&]#6#6$m(r%8$e&a$O*8#x%]#*#:$=$l*9&($H%]%1$u$w*:*;#b%N%=(U#A)p$m*<*:$R#n#X(4$6#s%a(F#B#X%N&g(F#T&C)Y#6#q$p(F#p$=%g#B#N%i(Q&@(?$O*=*>*?)c$p#4#n%a#c#X#N%W#X#$&##s&8%j#p*@$`*A#V&a)p#s&a*B*C%=$m#8#=*D*E%=$j$m%`*F*F*G$3&;&S&/$+#;#d%=&;%e)F*H#;$S&o#U$L)F*I*J$X$z)F&`)F&o#A)F$m%h$F#0&O&;$L*K#0&))F)@#U&;*K%g#z&;&;#G&o&o&o*F(B%=#$*L#v#v&o#G&o$9*M$F%N%V#G&E*N#F&M#^$##6#$*O$T$T%T#P&^&~#*&B#L$u#()p(F#.%A#b#b$|*P&7%^*Q%Z&<)6$f$d&%%x%F*R%0(G%-*S*T#W#.%V*U%E$`%x#X#R#^$d%y).&}&A*H%,%x*V%4$U#g&@(7${&`#6&S$^$K&M%N#8$8&m%7#y*W*U$t$X#V#z#d#b)@(?&g&g%N&M$W(U&[%E%P#.%3%R#.%H&I#2$m%Y*X%.#z%J$b$=$=$#$Q$^$m#e%7&;*Y$/*Z#)&u%e#9&@$R#G%I(V%;&^()*[(X%M%E$P&;&?(N*]#$$m(p$}%y%^$.$k*^$f(l%9%Z%A*T*_(M%~#>(C%^#n&d&d*`#>(E%+#7$w)F&S#:(c*a#0%+#G%C$,#6$&#S#Y$L$&%}&k#<$W%x%M&&&7%$$P#b$=#$#b#$$g#.($#(*b#Y${%g&m&A*H${$`&n$H&w#0%e&L$z&o&|$f#G$T*H%M$n$=(X&o#>$m%h%-$<$_*Y#4%Y*c*d#0$e#^#J*e#:$.%F%t#0&1%e$b#B%<#.*f$u(&%4$m#K#I#J$H#K&w&V$P#g&I*g&1&|&4#S&_#.#.%V%i$O#>%9()*h%j#7%L$O)~#>&o&A(l#I#X&L&?*i*j*X%T#^$&$w#F%T$k%Q#B*k%v&;$1$/(4$6(M#)&L%$&C%N%N&6$T*f(F#4(~#r)z%H&Q%o#W&5#r#b#,%F%9&@&C*V*l)F(P%^$e#)$8&J#B$O*m$T(P#@#U%y#i*m$}&B&B*n$F%c*F$]*o(F$i$i&R$e#k$=$=%x(+#^$d&1%x(V#:#V$`&M(P#.#i)h#$*p%-&@&=#:%9#y%x&a#Y*q&^(Q$T$w$P#p%3$k#G%w%]*e$H&I#L%N#B%x#U*q&g&g)(#X#O(Q#N*P#B&I#R#S#7$?##*r*r#k#$#u*s#V*r#d#d*H#$#d$}*H&u(q$i&u#$*t%i$)*g#h*u&((b$,*I$X#z(<#*&j$/(X)%$*#p)W&;#S%j$=#b#:&))W%7%7#(&b&b$m$p&C$4$D%v&`#z#j$b$^*v(L#7(T&`&7*w*p#$%I*x$=(E#L$+%A*y*z$<)c$e#B(U%~&s#]#K$/*{&@$^$*&2)c*|()#c&%#$&=(T*}*~#p&1%q$h+#%$&@&M%5)~+$&M#^&M&=$<$=$+&=#7$d$p%-#v$=+%$x$C#]$T$`$O#E+&$Q%]$P$]#.+(#x%q$c$R*r#z&>#T$?+)#W#B#J$1#I*y(&#.(G#I$b$H$+(I+*%H$$*r++#B%`$j$d%-#0%4#K&;$f#^#0$#(&$;${$~#P%.(V${&;&7&_#b%e*f(F#(%-$n&*%e%3$}#e$&&[$|$8#z$X#w#w#7&v&B$^&Q#J$z#=%E#U#w#Y&B)Y$?$b#<&=#r#.#2#q$p%~$5%7%>$`$`#$(c#b%T#.$P$7%J*P%I#B%@&d$g#G#A#B$Q$P$m%1$#%C#w&$#U+,%:)z#G+-$5#v#g$P(H#X#>%a(q#z&D$8#U&m%G*?$9+.%E%`#0+/(N$,%~$n#b&O$e*r%e+0%c&O#1#^#B+1$k#B#0#=#0%:#X$P#Y%,%y#($P+2#<$u%N%e%e%e)z#1#;(N#Y).&&$X#S%o%a#r#(%=#z$_$_%x%q%q#J%v${%C+3%h#W$T&@%E#d#S%G%-$m$~(X#z#W$L+4&a+5$m#G#Y#X&@(z(E(E%i#N$n$9$^$b#^%`&.%A&7$}#0#U$e(x*f#T*e+6%=#^$T&,(I#z#J&4#$#I*f&1#1#B%i&_#J#U*f&;$&#8#b$/%4$<#t&v#=&/#U%:#E#d&M#J%<$}#0$#&2$b#6#p&;%i&<#x%H(4*f&}$+&>%7$*$n%A*b%T&;#J&<%@%i#.%j+7$P(T+8(M(X+9$k#6)Y#$&P#0&I&_&Q#$#,$3%9${#X$e(r#B$H#4$u+:%`+;%>(F#n#d#d&M+<(P&>+=$z#^#i%4%2(I$P$P(F&T$<(E+>(+#b$}#$(E#p$*+-#p#B#N$5*f#z$]#B#$+?$5#z#7%-&B$,(P$<)c+@+7#<#$&H$k+.%8&>%D#3$H%/#0)Y&<#x${#B&`%i+A+7(3%i#1%-(F$n%E${(&(4&;&a#B(~$X+B+.&a$P%i(~$/+C%L#X#v#B#V&a#w#J+D$$%}$++E#w(1)x#z+F#w%a$j&b#=&`%<#.$z$x#y#A+G$6#v)x(X)S#;$T#r+H#G#w${#z#w#X#y+I#x#])p)p%i#v%<+J&<$O$#&(&c#0&u%M+K&$#S(x$b$R#$#W($%L#V&^$R%t%u$~$C+L#$%<#7#7&k$n&m&_#7#A)c#$%D#7+M%Q#>*I%Q%a&E#c+N$6#B%a$a$n&C&<&1%L&{+O&F+P&&&8#.&;#.$m%L&{+Q%3%T$`#z%8#9)c*f%^&O#0#7%8$H%8#b#0%<+O%8%^(F$Q%R(7%^#d#^&T#7%8&($n#U$/+O%=&T%Z)c#$#$%<%^&k%<#K(1&n#=+R%w+S&n&u).#K#4).%5(K&=&=#4+T&R$w#V&n%w%a#J(H%L%L$(*+$`#r&C#)#)+U*+$u&T$P$P*H#A$c#A&T&T$b#h$c$c$c*+$b$=$*#I#E$U$z$U%c(*$U#7$m+V+W${$H+X+Y#Y#6*4#p%-#Y#J%v%,%1#J#^$h#7#7+Z#.$/%T$/${%2#p#U&Q%e)z#g%1%q+[+]&o%R%R#p*4%R#Y$/#Y$$&T$$#r$/$t+^+_&B%:$P#X%e%w%=&g#$#($?#^&O$n#0$)$,#($?(3$D$b+`#G#^#J#.#.$T$d#S#(+a$T#($Q#J%,&w$P&M&a%w#R%0+b$^#Y&w&m%7#y).#X%D#Y#B#z$l%A$X%4#6&M$W&1(3%,#d).&[%M%D$X%H#g#<&O$*&?#t$S#y#$(b%3&m&#%e)p$w*Y%N+c$(#2#.%P#$$8#7%M#U)c+d%L#X%C%P#U#A$z#*#X$b+e$&#v$5%e%e#0+f%+#i*I#K#K(X#X#A$P&<%w$n#>&o$.%Z%]#*$m#0(M%F%>%G$P(l%}&k&k$O#O(E#Y%G#(&[*H*H$r$z&J#G#G&w$L$L+g$$$=$&)F$m#<&O$&#U%a#6#B&$#J%$$r+h#<%2$z$m#w$D&1#0+i$^#K#8$^%1#$#b#7&E$b%e#V%2%R#B*f&O#.#.%u$9#k*f+j+k#0%t&a&m#B#B#U%t(<$,&<&m%^#0%1)z&o&n+l)~$M&A$R#J()(4#^&$#&#w#U%$&@(<$T%9)p(<#.#7&.&$%t&=&T$3#N*Y+a$C&o)z#,#N%2&M*)%,(P(r(r%w%w#p#0+*&g#q*4$;%^$5#B%>%2#O&T&T%^(+$=&R#i$$$b+m$b$$+n#$#y(X#:#:#$)p#B#.$/&m#p*T&M(r#U#$&<%w$X+o#0(3$m#x#J+p#p&g&g&@%i#p#Y#N%i#U#B#U(X%C)>+q#v&@&@)p#B#B#B(X#B+r%V#M$~&1%E$w)>)>&d%Q%0#i#Y%Q#Y#^$F$F+s#8#8#.#$#=#R#b%.+t#$$H+u%C#R$w$H+v([%-#7%+$C+w$])p#7$d*y#b#p#d#T#U#,+x$W(F$g*y&W#z$<#b$~$;#b$e*y#$#$#g&~%~#x+w$W%T+y#i%T#7+z#p&?$W$#+{#g#,#-#S$W#U$u+|$0$D)F#t(&%Y$&$}%L#U$_#z+}&?+~*Y%Q&}&1(T%L%A&f%=,#$n&Q$8%o)F$D$8&?#,#W#N#z#b#^$],$%-%-#,%L#i#N$d&b&?,%)S$)#J$P&a$U#g(c,&#9#9%E$U$b)c#A#A#.,(#6$9$D%J,)(F&)%-%^)6&N$##G$j#J$}%N#^*r%g%i*O(U&@#G(I$.%/#z$S#h%q#q#$#b%D#b$l,*%0%a&o$#%g&b$9#A%+#9#>%G,+#.%M#r$3%9%4&$#r&)#0#0(I&:&5#q%q#E%e#U(4(s$<(M&:#b%+&)#E#E(t&M,,)z$m&T#p%N#$$)#N&o#=$j(I$u#^%q%J%g%V%-)o$/#O#O&T%N#.%i$P$9%9#X$9,-$w#B$9$e).$`%=#]%=,.(c,/(b#$#(,0$d#Y#B#$*j%-#$#$$(,1#7$(#7#7%Q$h$m#d#z$R#^%c%H,2#R,3$e#,#,(T#z$e%L$P#d)>$x#W%T#$%L%C#S(H&.&_#W$h#,&=(P&L,4,5%-%-,6%x$`%7#F#e%-&{$`(5%a,4)F(P$R%L,7#S$$#y#.$#&^%N%N*F%=#b%=%=#$#$#$#$$p$p,8%E$1$S#B#B#0%H&&%o$h&F&L%9&P#,%i,9%H#P%4#.,:#I#$$c$t%-$e$X#z$c$&%d$c#W$W#p$w,;$^,<%R%Y%:,=,>$}#W&o#;#b%G#;,?%n#p#<#.$u#b#;$~%G#0$/#J$`%1#*%b&1#z$w#U#h$b#U#p$&,@%1,A#b,B(5,A#I$t$5%=$5%=*f&g#q%<%,$j$j%-#$$B$?%w$C#2#.$?$?,C%x,D,E$U#(#7(1#b$c(q,F$]%i%v$1&[#I&k#^#.#^#p%A#A#S#;&$%V#r(b#b#7&J&C,G($%^(c%h&j++,H$P$j$3#d()$d,I&`&$#^&6$u&N#Y#$%<)>&[$g%0,J$^&{$|$x++$&*y%+&W$z#d$r(V$<#=#A$e$W#$%c#A#z#.&L%E&;${#j,K#p%-#A&*&_#;#9&1#y$)%-#r#p%x%9%t&n%L#b#$#7,L$w#7#p%>$7#L$8#b$/$<$b&1*Y%]%}$#$7#p%a#r,M,N#8$^%=%=%H%A#$&j#j#O%=#w$}%H#)+%,;+c&m#<%v%Q#4#p&~(3&L)h,A%=&Y%a$S#B()&5(X$+(q%9%9&;*p*H#i(3#0#0&m#p#n#O%1&O$5&*%1%+#$,&%=#p%r$>#$$7&$%C#>$*#^#^#A#X#@)c#;#$(3#X*D(X%e(l&_$T#^&[#;%q%r,A&J$u$>#X#.%u%u%E%w#(%}%v$L#p%F,O${&)#3$i)F%2#W#S&;$H#.#O,P$p,Q%C%x%1%1)p$c*?#d%h#p,R$j#U%=&Y&D%t$`)r&@#Y&H#>,A%r&*&H#T%u$=(X$+#q%y&W&1&,&c,S%E&5(b%h%t%1#i#3+F&_#U#F$T#U#0#0%-&_)c&[%-#$#1%9#(&A$m%e$j%O&~,T#0$k&*#B,U$U$+%t,M&|$d%i$*$*(l$R$+%j%j#($b&$&1#.$z#Y&N${$/()$&%9*)$w$n$;#p&;$/%h%9$^#X*b(T$m%/$},V&`&1$+$n%@%Q%5#;&P$8$8)F%H&H&H&H&J&[,D#,$S&M(~&Q%u(l&K#E%=()$<&6&$%^$m%R#)#U*F&Q$P%5%9&)$3%H#b%R%~#(#(#0#g&T&$#A&k#b%P,W#(%,&L%r(5&c$5*m%H$<#g$*%=#i&U$m$m#p#p#T%x$=&n,X%j$$&5%a$]$d%>%>&k&O#($P&[#W&T#^&H$$%d$P%x#k#6#$$)$P,Y#T%x#W&$&O$5#U&_#<%^(t#Y*b)h$/%i&M#t#$#O)o%Z*q$>&a$k#O#B,,#*%H#0$m$W&b,Z&b&n#((F,[$>#3#b&G&G$)$^$;#b#L#L#A#z(4)S#>%=#N&b&a*q&_(Q#N#.#Y)c%5#$$<%`,]&A$$,^&w,_#F(3#^$`$}#r&<,`#>$_#J#F$`(P$p(P%2#<#(%A*Y&&%A#.#b%F#.$*#2(+%2(P#F$`#J#0$`#A%N#p%2#p#p*?$W%,#d#d#d,a#$%1#t#d#X$f&D%b&@&S,b#$#$&B#d%q#B&u,c&&,d#8#X,e,f(V$J$]#x&E%4#,(3,g#0$}&O$n#c#$#(&{#^,h$T#b$?,,$>*b$^++$|$t,i#p%^$|%A#^#z&M#n#6#b#b%e,h%.#>#.#B$c(b)>#Y$1#d(3$$#R%^$n$&$+#S,j#$#r,k(N&7&p$3,l(N#z(U#R,m$D*F&{$L(P$+#d%<#9#b&L%`$F#6&`$b%T#c$^%<%3${#:$e%H+*%A,n*f&C#G#3%,&[#V%A#z,o#V#T,p$8(c(?#z(U$|%n#O#|#j$T#Y,q#R%4%4,m#Y#P,r%.%?%?,s${#Y,,&g$`%;%9&a%8$;,t$T,;,u#7#J$&*D%Q%Q%C,v&R,w+W#$$/)o%=)Y,x#7#|%?%H(7#b,,$=$=#b&*%M,y%T%3$5%I#<#x%D&d#c%N%5%:$$&d#Y#b#v#G,z$O$/(X&^$5$&#.%=$P#0$k#B&G(<$;$.%1%T#>,{,|$T*f,y#Y,}$`#$$9#B$,#S$/#c#K%g#^%Z#8$S*H$p&o#P(N,~#R&O(H)p%~$D-##:#P%+#S#b&R-$&(%R&:-%%>)x&?$`)c%w#U#S%^&L%5&d&[$>+1-&#Y%w$_$k%~(3%t%v)@#J&o&%#|(c$_%0-(#($P#>&@*b$L&)&w$=&u$h(N$e#,%h#.(T&~#(%n#r#S+g#:#G$$$&#@(7#$$}&B$C-)&&%x$t#9#J%1%}%c#B(<&2#Y%v$T)h%?*y#J%N-*%@$.#b-+&b#N*b%u&L&;-,$`(G#A$T#0#B$*%`&_(x#6#U&]&2&_(I--)p$Q#7%t%T#$$w%9(b$^)c#B-.%M$}#G$_&m-/#.%1(?(?&C()#E#E&o#J%=$-#<%a-0$/&;$T#:#c#c%r$b#U%$&a$1%^#N#F)z%t$.$5%7%^%9(l&2-/%2)x)x$;$)-1-2(<*b&m$b%w#b-3$/$`&:#8(L$P+(#C$H)S#$&n&G&B$O#c&A).$|(V#X(T%g-4%:(E$T$1(P%v%T%e$/-,%C$Q#c#F#^+c#n$3-5#r%?$b&F&:%x$[-6&D&T&k&N)F#9&L+w-7-8-9&($<&A%H%u%N&#)z%t#p-:#c-;&A(E&J#b,n-<$#%i#b#i#b)p&Q#N&{$)%j#4$5(F(F#n#N-=%o->$b%7$T&T#.%i$$+=+=%>$i$P&.$#-?#$$w#>#>$[(X$7#=&O%J$O&R(c#O$&%=*r$5#.-@$j-A$t$;$t$$-B&T&%#z#i$;-C#P#4#U$F%^$i(c(E$/%N$5+q$O&O$b$_$`$U%9&I#s%N&B#P,t$F*?#.&^&D*)&)&))c#J%^%V#T-D%;#6-E&M#Y#:%e&b&:%L#.&`#P%w%E&a-F#Y#:#x)X#:${$_$a&F%8#F#b#b,,(F$`$/&d%x%?&:%N(3+-#b&}$^&I$[#r+q(c$P%Z$p#X-G)c%i&#&g$T$T-H$T&a$P%i*f(Q&B%i+q$/%5&#%Z(F%H-I#v%x-.-J&@%:&A$5$$&a&##s#b$#$##($w).$]&u+W#A#2-K%Q$U$|$f$&$;&@&{&[#^$z%3-L%a%L$)#F$e$}$5&[-M#E$n$=#0%H&M%?$}$5$=$<)p%-$u&@$=#$$U#-&m#B-N#(&7(=$=$5#W$^#*&[-O-P#i$k$&$e%T#z#r&T%,&j#$$5&B$5#P#$$<%-&`%a(=$1#y#($0&(&F*>&((M%q$|$|&a#0&a#U&p#k&T%A#d$/%A#0%T$5$_&7&p$H%H#b#z(P%2%,#P%2&4#P#=$j#P#P%^#O#P$)&4#V$f$/*[-Q#7$g#A)S-R#(%2#t%R$g%r(4#z$f&_#W#W${$r%.#$(4(H$`#0#$#(-S$]&P$]-T%V$,#0#^#.#.#.$p-U#T#E#b&K$/%D$w$}*+(?$U&O%i$e$}#N#7#L$^#7$c&[&[($&,#^$+-V+`$D$|#J*H#k#d$f%]&S$u&_%@%h$d%^#d#$#p$j#B$D$f%x$n#Y$^&8$f%E%i&_).%T$X&,%]*f%0(F(b$}%h%.%t#7#*#0%q-W#t${$u$1#<$k#9+`$~&g$P#L%D)>#7&1&1&_$*$}$5$H#b$H#)$S$R#B#2#q-J%a#:$+%=&O&O%Z#S$P*H$~#p#k#l%+#n#n#^&O%=%]&C#S%v#P(r$~$F#W#p&B${#p&)#(#W$#$&#$#b#B#S#O#@$u$c%a&8%q&_-X#$#*$+%=$}&[$*#:%i#r#U#r&)#t%`&a+&%M$^&,$b&D$F%@$5()%])~$u#(*1#B#X$k#.#.$>&8-Y*1$8(F#;${#,%=*d&O&_#M&T$P%x#W+=#O)6#p#$#J&1&`#:#:#X%x$S%a%q$n%.*1#$#q%E(}$5*d#W#B$k#:#x#r&b$w$b*d#X&C#L-Z&T$b$p%R#p&<&g#s&##v-J&A#B#V(3#G%,#:$.#$#d%3#r*)*)#k&Q*m-[%1(r$T$}%=$m&*$d*p(3#A*e&L$|#z$X%g%,%1+%%D+(%T(M(M%~%@(q$c)6*0#(&s%i%t$c$S(M%>&b&g$8###U(F&%#c+[+[###V$?#R-]$=$=%D#X#8-^#E%-$l%T%/#{#x-_-`$T#0$U#^$Q-a$w$]#^#w#X%E&&(1$?-b%4$=#,(q%H#$#F%Q(&#b#(#r&w%D&=&B#S%G#E(q$^&>(I-c&;*[#O%r#J#<(L$b$P$)&,*y#r(E$j-d#V#3&$$|&$#.$_$H%7#.#t#6%-$c+`$f$d#$#z%`#p#d#:&p$j%T$b#O)(%e*f%.)F#b-e$+(r#k#r&K$=#X%N$`#>&$(P#K%`%a%T%g#g&`#p#b#j%a%A%A-f#z(F#$#:#:#7)p%--g#$$X#9${(?%3$|$]#I$W%/%i#z-h%O$U#(&v(x-i(H&$#n#*#A$n-j%4-k%`%8%9$e#b$r-l#T$z%+#E&M#z$`#z$=&m#]#V(5(4%W&B#=#V$g#7#j$Q$b-m#E#7#b(4*f#X&<-n&K%o%2#b&g#<%N#k-o&a%9#r$w,v#(-M+l#X#$#q%T#X)o(7%F-p$?-q%?$?#9#w#3#$%/$}#V&R(r$($(#0#e%Q+W%>%2#X$m$^-r$-#b#7#F&E#v#z#J$7$#(T%J#U#L#x%M%M%~#$#P%g#b&c$S#C#C)c-s#E#y$=)@#0&8##%i#J(4%2#G+-%T&^#(#i(E-t&=*r$w&D-u%T%r$9(7#W).&%#z)($S$$#p(M(4#K#($1%Z$U$m#@#8$9#A*f&?&g&L*r$e#y&o&K$b$z%-$e&O#w#b$?%r$.$`)c#S&G%A%D#.%a%R+O(H+a$d&$&b#^#X#=&p%^%i&D#Y%1$/*H#P#r#N$]#U#W#X#9#*$K(T#b%G$<$`-v$X#X#(#9$L&$$T#1#(#(&&,O#N#n%q%n&?(N%h%t#>&K#.#X&L#0#0$z,O#<&A&w$c$e(<$]#>%2#(&;#B#0%C#$-w$n)@+g+l#P%j&m%G&2&2%.%u$d$d&C&c${#S)F%N%]&*#$$~#Y#Y#l%0#@(P#b-x#G#Y%r$5#P#w&F&L$C$)$u$>(E$`$##p(&$T%w$#&@&##b%C%@#z$.&L%2#$%4-y$=#:#z#U#U&4%A%t$`#$-z#p#B#B#M%2&,#0%3-l$_&/%-$b)F$}&.$^(?#B&%%=$*#J$*#=#K$/%4#b$`$8#t$)%g#d$<&|$9%`#0#A*f#;&;&_$^%T&/#:#.#J#:$)-{#0-|#U*f%1#.#J-}#8%i(x&1)z$B%C#q)Y#7#2%x&a#^#0&C%R#Y$n$)#6$/%A#$%T#z&G%L(M&<$z$H#Y$O$b%T-2#{&;#w%@%j%A$b#J&1&O%q#c$T&>)x&;$/&<#7#b&J$1$9(4&<&A(l&(#=#k$O&m#p$z#((L(L)x&}(T#F&,%T)g#.+(%7)@(P$Q$P*q*f$}&w(L#P%4#i$^&@%A-~(r%w&g.##V#C#p.$$<%=%9$T)F.%#2*F(E#($n&J&L#A#d&=#d)c$##$#$(L.&$#$#*)#S$H#b*r#f(M&C#;#X$l&)(~$]$S%u$D%j&I%N#@%L)z$5%j&m$)&A%o%N&T#n#c#r#,&Q.(+7$^.)&L#V#{#p%C$7$`#;#.#B(P#y%i#b$w#b#i(r#;$F#r(E$*%T&R(3&B#p&,&@.*$U.(#^#i+-#O(4#i$P.+$]%2%4%>$+)<%c#>&A&b#Y#>%a$$$$$j%=#.&G#q%4%8)(#V$S*m$d&c#B$7$T$z(4%>(L$)#p#k#w#-#.&p#W%N$`$)&;$O#r&=%x#O%X$m#p%=.,(r&_#>$U#Y(r#$%^$F#B&I#K%=&^#.$,$;$;$C$),k%=#.#J%A&)&($`(P%w#$%o&$%5#O#X$Q&b$m(T&`#1$0*F.-$p$0$T${%8#$(L-~$m*e&)#B$0%L%.$#..#.$*).(+$)#F#1#A#b./$T&I&d.0%N#X-I%R)S%=&6%R#b(L(&&;(3%q#P&:$<&=$)&)#V%R#B#X#V%^&-%e%j*q)p#0&g%G$5$P$##Y$l$X%i$`$m#A%i#q%X$;%2&a#Y(~%5(r#;%C%,$M#E#0&##X-.#v&A$$#B&a&a#V&##X,f#s#0$X%J$T%/)c$j#0#$.1&6$})>#p#(()$m$$#p$}#*#0$*(M+O&:#p,a#(#(.2-/%^+O$T+O$T#M#{(7$m$j$/#0$T%a#:#F$^%x$H&6#d%1)c$})H#$%a.3.4&B$<$).5%e#0*?)c#b$&%/%+#^#(%+%+)W#Y$T#b)o%H)o#I$,$,#X$D#0#X$#$W.6#=$`#n$1(F$b(F%d$^%v#k$W#)$}$w#r&H$$&P&~#8%j#W$+$<#$#:+d#:&H$>#T#..7%T$+$1#3&F%1$H#)$m$h#E.8+q#$#T(&&=$<&F(&$`$`#r&6&4#V.9.:#$#{(l.;$b$w&@%=%=$z(l#(#$&6%=&4#$%a#^%u$8*f*f$k#J(&#0%-%-%-#6#6%-#N#t%]&&#6&d%A%2&]$8%4$w$(&<$P#Y$8%]#8&p#{%x$g#Y$=&J%-#-#-#t$,#r%k%4&m$`$O#-#r$8#t$S&<$u$F%N%2*b.<&b%N%,*Y.=$e&[$$.>#(+=#]#(%w$P#M$d$^&q&F#z$n#<&)#($m#p$6$^%M#G&m&)#G#<#T%R&)$^$+$++y.?$&#9%9&^+y$B.@)6$].A$9#b#8*y$D#1+q%=$h.B$Q#P#M#S$]$W#p%4(q#8#(&B).&O$T#^#0$w#=#x%Q&=%H#^&o#E.C#b#b$T%L.D$c#W#W)(%Z$R&`%C#.(b(b.E$1#I#h&j$$&1++#($d$}$}%^#$$_$+&;*[#B.F&C#T#A$i#d$p#(.G.H*f.I#1#^&k%v%-#{#b$g&}#w([%7(4.J$D#K&6#X$L$M#K#U#d(F*f#r#Y,}%4%4$=%3%T.K#$#e%q#A%v#b%.$z%2#B#=#L&S#Y$/#8#$%A#I%C.L%=.M&%.N#V$B#A$z$R$U#e#t#=#d#g%/$]#b%j%8#>$X(U.L#(#=${#Y#y#V#k&I&_#y#z&}&[&`$^#.%9%u%$#y.O%N#T.P$/).$D#W$m$~#J.Q%=%=&E#>$m#U%Y$`$^&d#=#.$(%E#z$[#(#b$m#^.R+W#V&=&#&##B#<%1%O&I#$%L%C$H.L#U%a#$$R$}%j#L(T&*#Y$($~#x#g$w&j#b%J)c%@$p%:&~%n#^%,(4#$%A#W.S&=$5%T#7#P&5#e%V#.(4#N%h.T%X$w$H&d#8#U#n.U&O&?(q#P#A#p$;&p)c$R#$$F$&&a%](M&O#X$.#z#^$<&,*^#$#0$S%>$6$H#*&k&S*f$,#>$g$P$n&o*H#g)p&O#W%a%5$?&o%9%a$P$9%e%j$+%~+a%1#X+y#=&I+y(T(&%>%G$<#U.V$+)c$e$7.+$`#,)o#z%u%E&u,v#G*?#,#:#s$_&O%4#<%3$_#Y%5#@%h$O#P&@.W,A%~#w#p.X#(#d)F#B#O&A$~&L%]$u#r#($f%H%N(X#Y(T#;&I#n#g%q&$%v#6#T#0${#0%N$U%L#W$X$L$m&J%,*q#0$n$n#d&,#d&;%G%h&)#B$T%v(I#b$m.Y&%&;$1&.%q&)&;&m#(%5&;)o%N#w(&#($`.Z#6#p#0&;$n$n(x)c#V$`+&#0#8$9%,(&#K#c$;$_.V%1#U$1#x$/&5#U%3&w#B$R&_%L&m#t%i.[#A&)(I#k*f&E%h#]$#%H%e%n*f$<#(#(*f%v(%#U&H*F#1%=.L$}#.)H$`$`#d#K#q#$$m%2#7#J$&&1%x#0%-&[#7&o#k%9#Y$S*F.].^#8._&A&g$p&;%`$|#A%C*r#@#N#B&,)p#w#S#7$>%i(?.`#K$`$})z#U#2#*%i).$H#B&A&;&D&;$P$b&b($#>&m&`)|%:(4%7*b%@#c#7#$$L&>$F#U#X&&#^#p$1(P$D#7%j$k&e&:$+$l$m&<%h%j&D.@$O#7#x$k&}$)$)#h)~$M)S#F&@%]&1$/#w$e#b.a#z#J(E#F#w(T&f$,%-$5%=,O$m$D(~#b#B%5&Q%i&,%R&a#v%a&F%x#0$l#d%-%o#b->&{$n#)$e%L&M%N.T#d#A#N$]%9,O&Q&)#0&P#.#G)>.b#p#.%N%N&g$H)F&$)z#b#2(P#X#B*)$5#;&,#4&6&f#:#p%L&A(F&A&O$<&a%:,9$U*^&_#$&Q#w(q$3.c&L#r#,#,.d$})c$p$`#B(~%a&J%1$^&=%t%i$R$j.e)c%i%a%t*H$}$<#b#U+=#0#i).$^%=#J#^*y#.&}+>%a$T$T#p%N#p)x$i&1&[.+%j.f%T,##$#b#S%x%x)>$w.`$m(H#c#V#-.g%-&B#N#N#r$S$F#O#U)o)o#>&S&U(E$5%>$t$U(1$R#=#r&L&O$+(4$R#z%]%3$P$`&B#p#0%N&a%8#0#O#k&K&^)c$D$/#0#X#7#y$X#S#w%9%V&H$<&@#:&M)c%T#N&Q#T.h#$$,#6#Y$O%^#.#P$<%X$_$H$d)o#{$,#U$)$O&$$9)o#V%G&F$<${#7#r%L%8%i%i&b$H#(%-#.%]#x(r$_(T$m$m&n%/$p&)&a$w&m$F#P#U&F$z$T%i&F,,%q$M*:$`#U).&8%N#X#A$^%N#=#b%i(&$c%=$/&}$n%o#N(F(4,&.i)o,=$z&F$p$P%N%^&O%i&<#X#W%a%i$,#U$/)W*1#V.O%G&n$]#d%G#r$X%i%L#.$<&R%i$d#O#$$`(3#N$W(Q$`&a$](~&;#P#K${&I&a,#%,%9$T#e%u(l#B%]%i$[&8#v#B#X%L&B%x&^$5#N%i%]#R#V&a&a#s#S#v$w$P#B$U#B#0$p.j)S%J.k%=%a.l%=$R$X&K#4#E#c$/%H#P&E&E&H$^#(#I$d++.m$1$F#$%N)@#6.%&}#B#B#h$8)>&T(l$3$i%J$j#b%J.n#U(P(b(V#*$&#V&m%.#z#R.o.o$X.p&_#Y%x(6&S(U&`)D#9$^$S&B#V#c&@#U#7$<%H&1$~#d+(&a$9$5$}$7%C&d)c$^$l$l$P$m#^$~$b#7#U$S)S&E()$R.q#*#V&_$&).#B%=%J$t%=+W&C$](H#:%=##&A$H,S&d#p#z&S.r$F$9#P$9#S$6&L(M#B$}#K%H&<#d#p#r%3$w.s(3%a.t#B&O*r.u$e$/#(#^#B%R&O#B)c$>#Y.v%r$d#O*H%h)6#p&J#^$R#Y#z$_$5%t#K#g&c)$#p&c$j.w#B#B#$$$#0&w&v#6&j$c#k.x(H&j(c$.#U&C%3$*#I&4#*$+#K$<&_%E&1$5$`%-%i#V#U*F&B#p&_.y#N#B&S&S#0*f#{#U#c$H&c(x*f)c$}%.#U$]#8$,$^&d#V#J&K(7%<#d$+#*#7#@(b%7%c&A)>&B&M.z#:$/#p#^#p$+%3%3#$$+&j.{&B&c$b$w%L.|%i#^&<%Q#B(P(4#p%-%o#;%N$`.}#$)z&L.~#$&f$$%t/##d#$/$&M/%/&&v&6,S&S&Q*H#)+q*m$`#p#p#p#$%a%H&1#T#:$w&v#B$w%a%Z(+$i$n#i$d#p&T#0#O$S(H$d$]#B$w&a*f&A#$&S$>#W$5%i#0#$#y&a&`&K&H$,#p(l%t.|%=#V$/$X#0#$$/%.%=(V%X&a*e$P-r$w$H#3(T$b%3&a%o&<+p(F%<&.%R(?&M$w#L+(&T#X%N$$&T#B#p$/&g#:&H(Q(3&a#;*>$S%u/(/)%L&A&a#V&a$X+q#0/*/+*y$&(U#>&;$k#U&O$$$$#z#:#R*Y#:$b$r(~$(&}&N&m*j#:(P%9(P&/$|&})>$`%n(&&N#0#c/,*Y&}$;&N#A#A(&#G#>++++)Y$B/-$O$8%>$?(q$f#t$8&C#^#B#F%r#=$`$z#A#F#k$8$e$T%C%C#w,D#p(q(G$T#^$z#p#X#X(N#.&w#b&%%C&,(&#Y%A,&#K&/&m#Y+W$)#p%r&##J&>#-#U#t$i$S#i&=#p#X(&&d%n&P$;#p#3#U+-#3%C/.#R$]#8#.%W#P(p%3*r%J&>#A$3$;%Y#G$m)c*r$+#L++$e#L#I$8%r#6#Y#$%E(U#*#$#d$X%q#6${&M#A%7#y#Y#T$;%g//%8&_,;$5(F%.#J$w&B$O&<&u$S%>(&#*#7%V$&#0)x#0%-&p#p%~#X#*$m(`(M%r#b#B#{#X&O$P#W%n%q%a#6#(${%o$m#X/0$`(P*H#B/1%t%L$u#$#b$&#G&b&&%d%5&d&@&##d%t$##U#K$_&;%E#V#t#U&B$P*F#G(X$/%A%Y&/#A#A*f$Q$b)x).%@(E&;&:&>&;$W#0#7*1(P#$%T$M*1&Q#W&=$8#,#N&M&M*1&J/2$$%-%-&1$F#O#0*r$b&T#p%a&u$i$5#F&_(&%=%V$P$/$O$P$w%8(b$p#x&b&d#A#W&u%N$O$P%L(Q)c(X&#$P#($$&_$b#w(g%N#0%j$c#R*+$C$B/3#.$R$e#M$U#E#0#(#0$u&>+,#^#z/4#J#G/5(b&?(3$$$+$$#S#O*f#T)Y#U)c$P(P$X$W#$$U#g&@#z&_#p$;(%%7%A(H).%/&m&v#k$n#$$r%A&[&B(4%-%T%T$$#e&g$H$5$`#X%J$P$~%Q#B$l$^$}&#%j#V%^/6$w%<$(#q$b#*$7$#&k$}$|$g%>&^%i/7$1%e%[%1#^#^#>%Z*f%r$9$P$)&O&_#B#8&_(M#X$l#z(4#G#p$X#X$H$<&D&D#K#S&@)Y%2&J/8#0#Y&C%G&[#k#U%v$)/9$g#>#d#(%e*H$u#(%$#S%N#;%u#B$h%r#O%^#6*y(l#P%^#e$H&c(&#J%h#0#t*f&,&_%1%E$W(x/8$`#U&+)c$/#M$`#4$^$<%C#*&4&;#:(X#d%i#0&1)()o(4#7&<&D$b$1#^%T$H%i&>(T(4&A#X(M$#%T(P(</:%.$b$k&F&o$u*H#4#;$H#$&J#;#(#X#W&K#8&_&M$<$>#,$m(E%i#b%N#^(+$l*m$w/;&^#O&T&c%j&1$#$F#W$]$H(4#.%=#W$k%-&H%,&K&^$5,O%x%V)c)o$,%v$)#0$H%N&/#r$1(r&a#p#w&_*e$_#2&I(&#X#b(x#X&8&c%1$#$,(?&g%N#X&8&a%i#p#q#U%u%w&8#:(7$;*Y(U#d#b&P$|(Q#X%:#7#q$T$|)H$f#T)~&6$d#t%:#d$X#$#g%/%?%~$u%H#X&^&b%+%y#g(b$~%T##%/%i#($P)z$e&6&b#4%$#O*m#^#6#T)~%i#B$U$W$n%v%v&O$u#k&)$n#N#N)(#k%j$n%9+w%N#z%9%$#K%8%v#A%A$n/<&@#z%`&@#g/=(E$C($&E&b%-%-/-$w(4$u$8$+$]#z$.%v#J#J%C#U#z%v$8##&}&=%:#z%`(4&%%T/>$8/-#.%v/?%-(V#b-)#(-)/@#$/@(E#0#0/-%Z#$(4%5*Y#3(E&^%y#.#S&=#>$u)6&I#.$Q(4*Y*F#O&=&=#3/A*Y)&/B&*#T#r#r#b#$/C#]$C%-#J&T&w#F#E$~#*&B*r/D#X$^&C#A#R#J$$#(%A$,%-#$#X%t&N#K#V(U#6$U&m%/#y#b#T%T#e#b&f#Y#.%q#Y&B%A&_#c#9/E$&%9#W%C&f$S#$#J#U%=$=$^%H#b,;#G*f&p#W%a$S&o(q#6%a(`$F#X#b(<$=#^#{%>&u)c$P#$&L#,%u%x%q&>&>%H#.%v#:%H%-/F&[$z&n&m#U#0&J/G#V%d#T$n&k-S#0%Y#K(?$^&C&o#0)F$1)c%g%A$m#$)z*b$$%H#p%u#$$1#.&N$|&I(4/H&u/I&@(V(5%x#,%o$n%d&##$%t#3#,&(.e#.(l$h)z%R(F%^$m%i&1#z&T&g+m(4%>$P%q%x$m%3$k$|$P%u#U/J#0#U#$%9#6&I#X#r#T/K&@#O%G(5#.%H$^&_#J$&*:#X$p%G#.&@&_%i$m%,%9%x&@&#/L#v$;$;$##R#e(+#e%?%?&*#.&K&K#t*T,f#J&1$#%/$X(L(F#.$5&L(L$k%e%]&O%-#S#3$T#p$k%a%]&1%]$D&J*1%a#:).*1$5$k%E&1&#&P$B$5#6$U(U$~%Z#8(1(l%N$z%Z%Z$~#c$z%.(&&[#(%i#0%r%.#I)H/M%i%3#$$;#S%3+`%2#B$`%3#0$*$]/N%w&}#z#8/O%w%N%2&b#X$H$}$`&}%u%M%N$}$~&^/P$z#X$8$C$U$}(q$c#b#(&;$P#q$i$j#p&}#K$i&[%@/Q#7$+#1&}$f(I#T*f#t%F$P&{#7$^$&$b$n$p$O%T#L/R$n#$#k*f)S#V%T%T#1#7&;*Y${#w#w)>#c&_#9%L&g$,$S%L*Y$e,j%@$w%H#L%~%O%T%D$^#B(F#I/S/T$&*f&D%a&O)c$e#>(<%~%e&Q$P#p*H%G$`&B%v$L#S&|#7/U&d#G#W$&#X%G(r%~+y$,(&%-*p$8%h${%N(L#J&&$~#0%h&>#*%E%=,O&E&,$`*f(&%Y/V%v$*(L)(#t$}#e$_(I#3$*%L)~&{&^&C&m&:#*&c(F%@&Q$w$D#,#$&p/W(F)<#;)z%H&Q&P#>$#&b)c/X+=#p#i$F#V(+$n)<&T$t$`%F#:#y$S#^#O#U$`#:$k%=%2$`$z%.%,#U$G*b%8$w$b$p&b#1)Y#1#X#L$$&_#1$p%N&b&g%C&Q#X$)&A%F#V#t/Y/Z#0+(#P$$#7#$$n#b%Y$n%i#Y$~$5(<&4$k$5*m(3#R/[$C/]#.#w$U#^#n%g(P#p$]#L&^&>#{#T$$#X#z/8$k/^/_#b#(%F#J)Y%e#G#6#n#B$,#4$t$i&}#B$H#K#e(F#c$r#0&m%4%4$e&(%T%e#z$8#V(?(b$x#g&L$X(U$B).%e).$n([$k#X&g$S%9#X#L$)(G%C#V/`$##((X&~%N%=$k#F$m%E#B#</a#p%>$R+(#*#i&)$k#i#$&)%a(l#N(M$R#0%a#*(q&g/b$t$t$_(4%i(q(l#B#{*H$z%H(E%N&C$`/c&$#P(G&L#B%y%}#>#(-e&)#O%Z&}$C/8$h,&%3&r$k$,#p&|%r$m&n#^#($L#S&@(X%r#(&C*e#B*Y$C$~%4#J%i(b&m%-#U+(%T&4#*&^%1(X&L$`$e%x$Q%v#($i#K&_(l(l&>%Q(c/d%e%/(4%1&A/e&m#6#U#C&I(<%v#G#($<&}#U/f/g#n&m(?#4&),O#4#N/]#i&L(4%N%F&N&C$m&I%o#((F#V&J%t&)*?$L#.&B%>%,*m(+$`#p#O$C&@&1&}([#i$e#X$`$5#p#,#i$i/h#0%y#i/i#n&I/j$)#:(l&^#$&=#6#6#0)Y#($k&m$`#0*e&b/k%/$;$^&>-F$j#L&I&I#b#X&#$](l/k%i#X&g&g(F$;(~%u$`-F#B#7#7#X$J%5(3#=#($O&>$/$b$P#(#(#b%$&n#I$?#$#7#A#b%D#z#z%L$r#b(`*f%0%,#d#V$n$,%/%W%L%R#0#q/l%D&P#V$##*#b#.(L%T(L+y$H$n#2*H$e%w$p(T#($z%u(r+g%N#9$H%w#b%N/m%r$)%=#A#p$m#w$p%T#z&;#^$P$^#b#$*f#=$e%r#P%T%9#.(L&A#=&>$O#z&_#(#0#p#(#=#N#T$#$,#X%X$P%w#X(Q(3%1&8&I(x#0#0#X$/%^%3&o$l#=$?&o#w#|$U#$$P#9(c#8#8/n$d#t$+&m(I#b/o%-#b#0.M%g$|#6${#X#A$r#6$;$X(F#>(c%^$^%0#b#b#r#Y#w$p#./p$S#b(E/q$m#w#b#J$?(&#$#V%=%X#z#p(L(M#z$D+y%R*H$U/o%1#>&o(H+y#G$L%N$z%0$?($&?%?#(#b#b*H+g&L&m#9#3$r#0%j(B#q#$#p(b#.#z#6&G/r#I%t$}/p%w$1/s/t#0#.$}%T#b%w%A$0+W(L$z&<$,&<#.$3$8&B%L#b#.%N%j#.%i$1#8)o%3#$&1&*#.$,%a$F$5#P#I(r%R$,%X)o%=(Q&G#0&F#w%c$1/u$p#L%R(U)o(Q#P#X-I#y#G#E&c#p&c%}#0-w#W$b#M($&o%>&*&($b(b%<$b#9%:#V&T#i$h#^%:$b#b&N$b%D$5&N&S%a#>&{+q$_#T%g&m#P$}%j%u$*&p#P/v$_%:#:#0#Y&c$b$b%D)>#0%v$h)z&T#p#^$*&N/w+O+O&g#>&J&T&K+q#i&c&p&K&g&*#X$)#7#z$T*?$R#(%]#k$d#r(I%,%2#V$X&g#9#W#W#,%?#=%Z$R$S&$%T$h#$#r#W%,#J#g&4#X#4*4(+(1)W#W%F#W#V#V$B&L#0*U$U(q#V#S(&#.$5#R(`#.%^%.)x#G%y&;#d*[%a$H#6%-$`#$#<&B#k#*$e/x#|%H/y#X&*&[%<%D#=#z/z&%$g(V#w$e$X%0$x#z%7$]%A$U$]#7#t).%a$`&c&g&[(b&#$#%,*U$m$b$P%-&c,,(+$5$H%C)x#x#e#L#V$S#.(V*[&5#I&{%G%--J&^$&&5#z/{&o*y#X(M#Y%u$P+a%9#*#b#>(`#7#V%0%a(H$9%A#B(L%V$U#3#L&w$+/|$T%a$`/}%G&2%n%-#6#F&`#j#0$`%.$z#d$&&)#{$~%N$;#.#O(`*I#z#c$z%}$T$T%Z%y%u&;&5$r).$D&*%4&##T%a&.$`&_(b)x#q$P#g%T%E#d#$#V(3&,%R#^#<%a#.#J&1%E*f$]#M#4&/#K#V$R&*%Y#8(I$T$z$*#7)z$+%3&A(3#3(L%q&.$&%7)p$T%a+q&g&L(&#X%-#P$)-J%H#V/~&g&a$`%+#X%=%-#V#;#B&L0#-.#6&P&p#0)S#4&(-J)F#$#d#N&{%d#g&K#.$#%j%R#.%N(c&D+q$h&D$B&4#@%a$;$P-c&A&T#T&@#z$`&[$*$W$5(+&1#4%>&8%a%N#7&8#(%n#(%n$U0$%N%N#B$;&^&],k%7$T$<%+$~%G#7&a$*#0(3%]%T&`%10%#3#.#$#(&f#4$~&}&:$~$T#P&f%N%N$`%4%i#0%G&g&*$<&a$T(3#I%,$<(b&4-.#X-c&#%i(3%.#0%L$e$]$n#n$n+%%3&I$P#w${(1#,$T&(#6$|#^0&$3(x$d%-$,$m#n%H&`#d#R#X$U#Y).(F%d0(#E%H%j%D#X#p%j$R$S#w)o(3$~#O*r%?%>$d$(%,%3#@$P#z#@&H#W#X(3%N#Y#(&J%?#,#O%t#W)F(E0)#-0*(b(x#1%Y$}0+#d$`&8%/#X$/#z&G%r$z$l(L&A#8%A*)*r&A0,#-$d&K$3-<(F#-#-&G0-#@&=$*$;)c#r%t$P&G*F)p#X%0$e)p%D&a%L#=#E0.%Q$&#E%Q#.$Q$~$w(3$R#0)3#S$?$1$1#8#|#w&7++)8#J#r&,#6%T#{$R#b#.$d$+$?#T$H%j$f&D&J#E0/#R$H#z#b#(#w$~$R,d&I#p#z#$$n$;#V%,$X#V(H$U$^#z%4%T$W$)#7#I$P$r&S$|%,(F#7(r#L#W$?*[#$#J#V#3%I(F$$#L#d%/)c00(T$/%g$5%C#2&#&_&L$P#z01$S&<%D$m&I$/%~$}$6*Y$S#=&=#q%=$$#b$`%~%H$1%T%R#>#8#r&?(4%a#S$P$.02%1$l$/$R#p#z$9$,&n*H#z#W#d#b#B&S#K#.$}$?%t$n$=&d%R#@#3%C(H#(#(($#(#S$&$P&u#U&)(T#S&w$c%$%y&&)F$r03(4#(%2%-04$X#1#(&*%v%t%h&2#p#w%E#@$H%q)(&[#0%t$]%R$}%i#)#($}#q$`&m$P*e#1$0&4#I$e&[#t&;#:%<#=#8(b)c$.#;#1#U#z#U$}%7(I$/$<#{&/$+$m%1(7#b$+05#N$W#*&;%t$}%i#U$.&_%i$H#$%y${&?#d&}$~$`&D%C(~$+#*$,*l&<(T#z$+%T(L#x#d*m&f$P%j%T%t06&1&&%-#K%d#X&D#B#p%t&I#4$T&Q#b%R$8&P$<%L&_%t#.%a$,07%R%$#$&K0809(P%h$P#.#{$l&v0:$,#i*m%0#b&B#-#O#0$]&T*?&R$`+-#N)($l%=(E-.#p(P$+(V#k%=#p)o$`0;)c0<#;$/$5%-%x#$%X$,#$-J$}#.&F$T&a$F$w-.#(&L0=(F&I$/-.#L#A$}&I$P#N$5%N#N%i&B#q$P(r-.&##p%w&a0>$<#=#E#00?$~0@/q0A#.#S#L#.$?#U$+$R&,#6#{&w#|$?%t03$d#b$1$f#V%T++#r$P$U$/#z$<$r$n#p#b#I$~$|#z$)(H#$#W$W&?&<#J%g+-*Y*[%=0B&_&=0C$$$5$S$.%a%~$l#p$,(T#.%1#.$}$X%i$}#(%q0D#),O#k#U#1&u%$#3(T(4%C0E%2#S0F%y#w&m#q$`#1&a%1(I$0$+%=#=)@&4(b$P%7%y)c$e%R(b&[&;$H#z#x%T#K&J(L#N#X#$$`&F&P&Q&I%i0G0H*b$/&T&B*m&=$T0I)c.N-.)80J&w)8(l0K#($;#g#q%.&w%i%i&)#*%u&R%x$M#()~%i&I%x%N%u$c$c$c$c&O##&##z%L#e$z#V#Y&b$z&[&w#R(70L%~#z$n#B%.(r#j#P#0#b%M#e&a#r#=#6&>(4#R#e#X)>#U%-#.*m&k(4#.%~%L%.&##6#.#.#v$^%L(P(V*f$^#A#A$d#R(L$^$z(P*j*f$X#$#V$e$l(P#$0M&<*I*I(P)c&D$P#$$^0N$P#0(M#J&A&;#p$]&B$d&B$<&I$.)g(P#N#0$R#$&k)~$d$R%H%H&J#z#*)H#$(?#$).$X%N#b#0#p$/#q#p0O&m#i%=%=%a#{$R&=0P&J%q$~#{%H#V$`&_%H&/%t#S%=%Y%3%3&O&M&P#$$<%,&M#O)H#i&M$]#$%=&_%w$b%>%>+W#t#n#(%7-f%70Q*Y$((8*e#]#]#4&I$9#w$.)>%]$+0R#6#$#=$)%A#Y$p$)%>$L#J&A&6)z)g&=#h0S)z#.%>0T#A(F*q$(#$$C#:(V&$%^0U%H0V#T$R$.#b&})p#T%T%x$X$&#A0W&T&g#b%8%D+%#G#n)F$}$<%]#k&d)Y#W#Y%-$e)F$1$}#g#;$C${$9#Y#;$*$<$*#;$<)~$*$<$<#;&M#k&$$9$*)p#b#T%8&*0X$9$9&g#0#0%.#=%j#$%j#=%.%.(x#$(O#.#80Y*)#($;)c&10Z$?%a#x$~&;(&&w0[$U$Q$_$u$z#b%^#z%q$|+*#h$`$f($#A#|+`)h&v%Q#0$1$b#(#6$T#p#p%q)h#W&`$n#I#,$/$n#U$~*Y#T%q#R$;$}%v%r(7&`#w%g#b${/a#w$~0]%T$P%0$g%A#k#b%<$8%,#d0^%H$m$}$^&g#<%;%N#W$x#B#h%I#$%J$6#F#<#b$5&j&j$(%M$7&/0_#w0`$&%D#b&J*f$/&J$//S/S#.$/*D%V$[*j#((X%L%X#v$1$;$1#S$l*>(G(x$7(<(U#N$9*f&,$n%,,D(r#.$l%H%4(U#>%c0a&p%4+7(X#6$z&##X$<#,$,#J#@+y#6%o$L&/&I%C%Y#T%v&q#W#]0b#:0c$?$n%y#z#z#Y%q(P#S#<#6)F%t$C$_*f0d#4%H(%&#&6$e%M%E(X#r#M%`$+#I(x%e&]&o$b$`#U$5#0%A&4%-$u#z$P${#1%:&f%c+80@%R%:&u&A%j%y#F#$$;&T#.#6$/(L%R&F&6$u0e$p#h-/%o&=#z&A(F#p#4%N$50f%R#b#y&,#O$S&L${-/&T&J-t%a0g$]#b$5&B#^&J.+#q0h$d%i&B,k#T%V%X)6$</F%9$$$)#$%~(?$<*b)6$z#(0i&F$w(X(3*j$P%o%E*H(?#B%N$p([&#%,*j#v${&8&C0j$_&S0k#O&S#w$5)p0l#.(L0l#1)p#b#b#F$`#b#b$l&`%T#E0m#0$Q$b#0&k-D#p#E#0#0%E#Y#E$j%5%5%5#E#7%v#r#7%v%x$F$F%u(E%x#M)<#*#^$~%w#M&B#$$]*y&`$]$|$]*[$f$|%-%N#I$`$M$X#V$D$=$;$P#F#M#*%N&c#h#p%I#z0n#K#X(H#0(M$9#0#U$;&b$T#Y&1&u%t(b$8*Y&p&?$Q#$&:$M*))z$W#y$b&k(+&^(P%N#$#.$`$p&b#(%N%N#N(~$-#@$`$`0o#B#z#g#B#B*)*)#$$B$9$5){#]%D#E#J&L#S#$$Q#1%L$U$T#0#0(H&j(&#*#((q#w%=$,#b#q%-#z)6#U#^#b#(&B$1$T$?#z&{0p0q#V#.%^#(0r$d#R)($j#.(E0s$f#^$$%7#b$+%^&M$)#t#G,K$J*[#;$m#A(b#$&*#U#X#6%e$P$u$M#V%j$e&;&v$X&`0t$e(I&)#X%9&m$8$g%<%7&[#$#$/;+=&.%g%8${$;#9&B$l$b$P&%$R%i#c#<#Y*Y)p$U#d#g*f#z#k(7%-#U#z#P#t$]0u#t#t#R&t(F#w$e%H#.#W&g#;+7&;#y%i&c&#%@#X&<$m$-0v0w&C#0$l#w&d#^#.$#%/0x%/%Y%J(q$Q$50y#z#0#V#w&=%=$m$Q$g&<#x&k$8$S#I$T#V$w)c#z%C#2$O#W%E#M*)#W$(%M#i%H$?$`0z&1#g#X$H%>#r*r(V%A+-%-$D#i%=&s&^#0&<%h.a&#%i0{$H)x$m#u$R$~$b(&#U#X&p#z$?$m%3%-%+$+$e&o$,$,#>&C#^(5#p$.#X$F#V(F#X*r%0%4#8-u&D&C#K#Y*f#p%E#W$t0|%Z#B$9#A(<0}&O#A(<%A$c#A(x%a$P(M0~%e(F#1#J%`$8%F%G$<#7$_&o$P$p#A%i%i%Q&,(q(q%/#S#W$e%,#<$`&2$z(?%N#Y#U%Z1#*H%3$F#w(L)F#z$L$u#3&$)@%2$>&&#R#X&o$;&O%<%^%~#p%^$e#{$F&^$H%.&`$.(E$z$X%q%^#B$c%$$~1$$r$`#O%x#r%v%w#d#(%3&J(T&,%-$u)c#z%G#(&b#g#U#T#{)c#B#$%D$00}&5#]%T%4#E&W&#%-#$&b$;(U$C%i%i%i%a$[#8&m#q#S#0#0#z$<&_&_%`&5$_&,%a#0(b$8%M%e1%%i,,,,&=#1%0%0$r%<(x#p1&%M%,$`#z%R#W)H#K$R$R%Y$9&o1(#w#q1)#F&~&)%L&1$n$F#2#<$~$T#U$;#U*y#.#d*j%A&4$b&D#;%C#U%T$*$91*#p#7#(1+%t$b&;*f$+#r$e#4%u&v#y#N()$*(E&=)z#U%n#A&:$m#71,#7$+%T(M#x&b#X(l(`&;#X#Y#p&?$)%f&o(4$p&@$T$r).(<&;$)#0%V&}$F$F#|+(#p$d$+$&$`#.&.$M+c%L%])x%T1-&:$}(4#p$z(M&<)~#2(<#7&A&##x&D&_%r#P$#%-%t,O%0%D&5$g&a#T#.#X$n(M#0+g%i(F$h%D#t$S#V&L%M$<%t#p#g$}$H&,#J#U%c*)#0#$#w&T%-%N$}%+#,&I-<&Q#B$X#p&P,O&O$e%j%N%5#)$e)S$w1.$;$e#c#n$n&_+T#d&M%L%R%d#I&&.L&=%L#;+7%=%Z$m&B(c#r$m)F&C#d#{&{0v&>*j$D(P&p$<#O&{$k%-#X#U#.$T#k$]&b&6#N&@$w$5)()(&I#0#i1/(E$`#u$+%<#A%,%N$b%=%e%1%q$$(r%q#x$d$*)<)(#G$}#z$$&^#^#<#=%a#p$[$+(H#($`10)x$X#0#*)~#.$R#=%X&I&_$+#0%a%](A%]$k#U%=%=#.#w#q#S)S#$&|&=&H#W(P$<&m&;(V11&A#y%-%2)x#B$]$C$/$z$/+[$`+W$R$[$j$w$b%?&:#r$w&n12&;%8$~$_#x&P&`$0&K&C%T$(${%i(L#;%a#(#e$`#0$*13(b#P%L&a$H(](I&c&*$P&T&6$P%j%R#$$}$/#X#$(?&I%a$e#b%r&f$b(F)c%o$]&:%x%c&c#i#U(4%=&6(L14%<#X#V#V$k#O&K&_%^%G$p$D#^)()(%^$7%N%j%c(q1012#0$w#.&S&_(F#8%j&S&L)p$;(Q#$$P#0#Y$<$P$m(P%i&g&7(E(3$X%,$b$]*f15$*&a#.&A&Q&I&I%=&$#b#U$*%2*q#X#.%L&I*q&##.$*%N$`$[&f&I%C%a#$/L$>(5#d#d%N16%R#=%a$T$)#d$}(<#z$}$}%N#d#0%]$5#Y)F%<#B%2%2$*&F#p#r&k#8$h#.#8$C#7#*$$#n17#0&O#w18%=&b#F$,19%W#7#$&>#q1:%e#R%H$T$1$1)(,}#6(3(3%Z#($S$m#b1;&;(l#A%^#(#I#G%]$8$c$d$d*[%Q&K#z1<#J#z%H&p(U$P${,D#8#A#c#g$e#A1=&O#Y#X#z&v#c$}#6#6$P#V$h(5#9$z%2%,17&W$X$z#T$z%i#X#>%,%O#F%/%=%=(q#z$^%:&d#V#$$P,,$5#X#$#g&*1>%5#$$c(F&c&*$#&c#b&Q%>#n%A(X#=#(%E#J#81?%9%A(3$t%r%e1@#r&_#K$n%T#z$P#n#^#z#X#@%-$)&;#A#J#T#B$9&@%c%=$_#b&$%q#Y%L#(#(#0%Z1A&b(P#p#p$L#X*Y%D(T*H&O&O#0,}%q#6#U)6#$$+&D%C$T1B${&)#U#@)F#S#<%e$|#P$c&H%L%i)F#N$C(?&m#J1C$9#t$}#1#0#J#7&_&1#B(b(x#U#z&;*f#U#z*e$/#A1D#t19%i#7#I&A#V%t%1#z&;$*&b(?(&#d#8*Y#p$_$+#0%`)z&,&<%i&=$|(M#h#=#p%/#p&;)~$<&:$|&<&<#.#^$l&O%^#$%-(E&A#$(&0_#*#d%=&>%@#$$1%i&f#I$M*b#(&Q%D#)1E*)%H$e&M%N#U#b&A&C&P%,#6#0$`&#)z%^#I$m&=+w$1%a&Q#n#n&>&>#0(4#t#p#;#X&Q%a$u#,(q#q(F(r#=#8,D#b&L&L#i%,(5&T&}$##p#(#4&1%q&T$$$$%=$m#N$5&B(X%a#^&k$w#=$)#>&^#X$/%4#$#W(V#N#(#.#q%5&#%^%i%W#X1F&_$<#V$D$/(q$/#(&<$`&b%]#x$p#P#J&F1G)S$]&I#J(?&[#X&,#X#8)p%N(&%a#V&g#X&g#K#:#6#)$z%~%i#r#p&H%,%C(&&H&Q%,#J#V#P1H&1+%$g+%$j#I/S$(&m)S#p1I#B%F&;%,$X&_#r$P$S#q#J$P#G#d#U%w&k#U%w($$7%,#$#$%+$U#0%o$Q#$&B&C#z,O)H1J#J#|,##T#$#I#I/j#b1K&v#b$?%^$H%Z&;*f%W&M+7%=&v%A%4$X$W(U(U$b%0%-(H%x#Y%3#y$l%T#$*y#z$e%:#z,O#b#b&v&}#$#t%4$$%7&_#N%,%r#0#p${$;$;#z&G1L%g$?&=&~&R(F#J$(#F#x#V$#$m&&&d%;%E*r&^$}*H)h+7#r$/*H#>#X%~$n(N#F#$#0%T(4#8*I#.#$%+*r+y#{+z#X$<$<%g$`%<%x*p1M(T&;$X*U$u%w$=%o#@1N$g$g%q&;&#)F#B(&1O#b#Y1P$0)F(71Q#(%1%1#z#I$/(b*Y*H&4#A$l%3&;%<%<#z#0*F#B#$%r1/%R(U#T$+$O%7(V*q&<&;#x#]&S1R&}1S%H#C+7%i#J$T*q%g$<&a#X#n#7%R1T*Y$/$P#U%o*)#.(P&B(N#q%-$F$`1U$`1V#.#T([1W%q#q$w(5+-&Q&a&M$D%=*)$,%X#N$<%-$H&^#r%2%-&a$F#x#b&n#r%:#7%r$/$;&C%G&g#p$P&a#n$W#Y&8#7$`&}#$&a#G#p#p$b#K1X#z1Y#z#R%3#.#.$`1Z(b#B$#*>&/#t%L%L+=#7#=#.%T$$%L%D$<$b#b%Z#p&B#U#p1[#0&a%e(&%^#h#.%@%i%71]%2$H%u(+$T&#%,$`#U1^1]&#&a$n#.%u/h%u#B$#%L#7#N&a1^#.#p$e%v#0%7$H%,*>#8$H%d$$#b)>#.$z#T1_#b#)$/%C#F#7/j$#%Q1`$/%h#8%E%j${#(1a#b#c%-%E#d#)%Q#b#y$)1b#$%N$$1b#B#p#B#B$C#z#8#8$5$R#.$]$w$h$R1c(T$}#J#$$?$w$m&B#(%4#.$w$m%e$d#G$b&$$n$m$m$$$b,j&C#A#b&j$f1d(I%51e#{($$}#$#$%j%H%3$n%3$}%T#V$&%7#w#w%2$z#z$`*Y$X%1$^#X1f&}$~$U#$#Y$b#c#$#$%,%.#g%-&j%,$;(V$r(T#V%/#n%9$}$w#$&1/q#7$Q%a#7,;(&%Y$#%C%=13(E#2#q#U$n$~$S1g%2%@&#%=1e&j(71h#9%D#$&I#V#L%I#^#0&f#.#b$?%d(M%e#L1i#7$9#T%r#N#A(G#i%^(8%M#0$5#>#J$P#^#^(L&$%+%=#W+(%T(3(&(E$u+y#J&m1j#;%a$,$c$P%q%G$O#$${$m1k#6*?#N&C($#.#(%x%y#U#Y&)#<$&1l&21m#P#@$`#.#*$L$n%o(E&/#0*Y$}&/#7&_#7%h1n%e#I$e$/#z$F$9&a#(#0#w#4#p%=$m%M$P%`&C#K#V$^#B&1&_#F&G$}%O#:#U%E&f$~&B$`).1o&1$p#F%i%L%a%L#*(P%T#y%1%j&?%H$T1p&=&;$/%a(T$b$b#b#0&P#;&)#X(F(F#)#n1q$`$D$r$<%R1r$},O#p#P&M&M$H#n#$%a&=&Q*0$P(E#T$}*m)o#p#c&n$&%a&a%e%i$$#.&R#i$;%=#4#^*@#c#7#i%x*@$F#k&_&K%x&^$,$P$5$5#W%2)g#$$k%2#6%=1s#$#$&B(Q)g$T&n$O#d$~%]#$%i$`#0$`%=(&1t&_&8&I$n#U#N#X#$(b#n#B%e#3#U#3$b#N(Q$m&a&C1u)p)c&8#$&^%2#B(&#B#.$C#z$?#.#J$R(T(Q&B#(%4$w#$$w#.$?&=%=&6#Y#G,j1v%e$L&j&$#K%5$f$$$&$z%3#g$r.=&j#c%j%T$e$~%/%,%.%-#$#$#L&I#7(7#713%=#>#V$n(E#T%7%C$#$w#$$&#2#q$Q%h$}$~#J#^#0#i#^(L#A%=#L1w&$1x&)#V&2&G1y#P%q&m#U#01z$n1k#N#@($$,%x$n#$%O&C*Y&1$`$/#y#:#U%e#0&_#N#w%M#B$e%L&/$}(F&^%j$/$b&?#7$T%L$H&Q#n$`1q%x*@#i&a$F$$#B$T%2&C.Y$T$R#*#.$R&O&g#p+l$p&T&O1{&g&p&=#(%H#X(+#S(b#r$P#K#b#b#B#B#7$)%=)6#$)6#$#B#R%Y%e$)#q)c1|*H#2#Y$F#p)c%]#0#V%A$d#p$p$1)c&F,s%t$d#$#b%<%W%M#6#|#6%7#|#A$h1}#=$l)c)h1~2#(F(p#t#0${%-#0%A*F#t#6#p#$#0(F$)%x)c$$%r%T2$#z&&%Q,D#$*[#S)Y$p$]%x%u$D#b$(#V#7%-#w$($#&/(b#u$W#k#L%q&W#$%H#t%32%%N#O%=#2&/#w%A$}1F$5#2*j$`%i$w%T%5&F&F#8%5#M*j$~%G&8%/&C#)%v$g$.$P#u$`$,#z%x#;-e#b#.#,(&$H&[&,$+%<&E%G#K$M#.#k#$2&#z%7&]$D&T#$%?&C#S#b%y%o$+*m#T&8#B$F&B#S%i$H$U$P*j%-(&#r#B#)&_&g$U*j%r%T#z&;%Q&&$D$P%?#,$p#b$]%x)Y(b%7#V%u$($`2(#7&W$##L$W#t%q%3#$1F#b2)%=#w#O%N*j#w#2$H#8%T%G%5#z(&#.#r#)%/%-$~$.$g#T%G#K%y#z2&&]$D#B&8$+*m&B%i$U%H#p%5%`&j#p#>%3#>#n#*&A&2&2#X#E#z%.$U#(&B&c$m$P#w$$%^-S%/&C&C*Y2*)>$e)o%2$$(3%,#J%,$)$p#y#w%D$=&d$U&D%d#p%.%j$m%,$`*l&A#P#U%N%,&^#8#w%1%,%H&1#i#i$5&K(3$(&8$r$r*y%<#^&m$i$$#z2+$`$f#b$O(3*y#((3(P%4&`#$(c$X*f#R*Y%g%4%A%/(U&~#V2,%2#b#z&}#V&B$;${#Y2-$-#$#.$=$P$5$=#V&R%I-$$#&c$*#q*Y%N&/#b#J%D&&$`(V#i%-$P$=#.%,#.#r&o%d#W)p%a%+#y&R$8#r#@%9*>#3#i%O$O$`#($_#U*?#J#.)p#Y)p$L%N&|*q#Y%H$_%C%1$;$r&*#$%d%t&&%t&L#b$&&@#b#0$=)9#M%9#I$e#c&C-/$`2.&A#Y#z$r*Y&/(x&G%1$Q%c$`%w(<+l$O(P(c&@%1#.)p&}(4&8%-&k%N&T%d&A#b%j#p$*#.#P(P,s&}%t$<%$&K2/(5%c#Y(+*40@$]$)#I20$;%d%d$$$$#O$O#i#i$F&T$i+q#L&K(V%-%-#V#Y$)#i$i#3#.#^(3(c#O&d#b(3#b#N$)&4#U&g#O$P#U-.&a$/(Q$/)p$O%,(l+q-.#p$*#(#O$n%Q#T$d%,%1$=$=%Q(M$?&#$k#.#Y&A%}%>#B*f$3%,)z%>$=#b#B%1%w%i#0$t21$#%Z#U(3$P$W&_$]$?&B#L#r)6-M$W%e#|#(#t*e#L$T#4$R#d%,#L$e$X$W&M%T$]#L$^&L%r$z/y(U#V&<%e#R$~#b$b&m#$#b#7#g$(%Q#Y$5%J#G()%C$~&E#b%5#@#0(H1D&;$m#n#S#z&)$~#$$X#n%2#@#w%=$c*?%=%F#$&L$T,O(c#g%u%r$L%n#@*e(x#.$^$P#M(%)<#G#A$R#r#z#w#z$1$]22#0$+)*$z%T#*&;%N%a)>#4#U&_#y#n$5%2%+&T$d$]#O#F)o%F)c#$#.%y$(#0$`$R&I$g#X#X%N#O2321$#&_$W$?#4%e$L*e$R$z&m%N$~#b#$#d%T#X$b&)#7&E#b$5$~%C%N$5#n#z#@(c%r%=,O$c#@*?#w(%#z#.$1#r$g&;#*22%N#n#O$j$z%/%/*p(r(b(?(?%/#y$|(b(b(b#y(b$|%/(b(b&C#x%X%X%T*?*?#$$J(b$]#7#x&T(V#N$U$T#0#0#($w#$)F#u#(([$c&o($%i)|$+$H*[#G$]#^%1%e2425#I$H&;#U$<%H$t${%D#b#$&S%A-M$W$($e26$c*Y$D(T#r#$%,#W%=#<#A%L%$#.#]#$#J%y&d$w%c&$27(T#h%Y${$i&S&_$w%+#A%a#8&7#V#8$e$e&o#W%1&p-K25$S%J#^#7#>%j&K*I#K$<&D%=#X$z%G&%(<$$28)c$W%N#A$~$H#0*?$*#U*a#$$O&;&#%-&G#0&A$,$i$,+4#M%H%1#0#7%T#A$+#^(b)F%e#*&1#8%w(V#U%`29%7$b#3(4$w$O$e-S&;%j$O$T&>$b%u#,&M#7-F%H*?&K#n$i#7)z%H(<#O&R+-$T&_#029%e&T#Y#7%-$b#u$/$,24%2&f$((I(b(b(?#X&;2:&##X#$$9(+#(%9&B&O#0(q#x&c#S#L#z$3&F$f%E2;$j$n&?&;(1$p+f&?#^#Y#A&O&`#8%-#6#9(H%r%:$e&2#:#O#L$##V#7%g#0#2%3&*#b#.2<%Y%E$5#p$#2=(M%A%V$&(M$+#B#>&p#p%R#z#^#z(L%](M%A$.%Z%i$;#p%,#X$+%+%a#(#6&))F$~%x&2#g&I${&C#A%+#q#T#Y%9#i#$2>#B*f&.%r%e#r%~#0$+%Y$*#q#q&:&A%@#p#x$)#w&2#Y#^#q$+%]%9%-#t)>#z&T$m#4#d#i#B#,#S2?$}(+%-$w%-*m#U$&#t&B#O).#T&b#:*b%V#K&b&2#L$<&8#N#A#(#B#N(<$X%C#p#K&8#b#A$C#8#P$g$~#$$U#0#E$m(r#t#T$}&p%T$d&;#z$+&`%v&~%42@&O$z%j).#3(r%@%>*?#3#A$S#b$P&=#>$m&o$5*f%g(`&I$F2A$6#B2B+.%y%N&a#B(T$g%2&,.h(r%y%d*H%1$P(&#d$}%E%x1D&,14#e&m&:%L%C#3(<$+%9+`#c$6&A&=&P#N#0#X&K%>#$&=%+$5#p%x).%X#$#X#Y$<#$+.#x$w#3#B$X%L%L+.$j$52C%L#B(b&&#7#A#7#7#X/n#:#@#X$H$H#8#$&T%w%.$C).#8#R#z%T#b#R2D#z#]$h$P#i&{#M#w$]#0#^&O&w#((q-U$e#=#p#$%W#$&o#p+%$T#8$`%.#:$m0R$f%T%E&p(3#I#z2E#|$j%e$$$i%7$m$T$|#p$?)>++$d$+#$%^#6)F$R$m%Z$h#$#I#p#2-U$p&`$3&;%N%e$1$=#w${&o#7&[#6&m$X#9&`$z$;#6#0#=%0%+$~2F%A%T#72G#b#Y&W2H2I&_%.(6%3)o#k$r$r$;#V%H([).$S$T#z&(#t$T#z#X(3#6$^$|$;#J%7#r$&$82J2K)D%A$8%x$n#$#=#L%;%r$`2L%E$R$5%H$(#F#g#7%O&m$m%Z$~&k#q$S(F&I#.#0$}$?&R#b&c&B#^.R2M%C#6#$#V#q%@%I2N$P$P$l%Z$Q%>#.#6#x%L#$$m%J%M#?#A)o+W$T#v#=$k$h&O)(#b(G#8%a#n#A*j%1(<2O%Q#I&o%R&b(M#S$j$+%r#^%j#0#N$9$;&O%A$R%~#K#N#S#b%4&_#^#0%D2P*?-)%E%^$n&O(B#:$)$&#Y$P&W(q$F#X&}(3#>(L#X,D#9#V%T&o%R(r#Y$u&;$`&w$h(T$u$L%I$X%r%N#X(P2Q%~&[2R&L%M#6$P#G%y&I&m%}$O*H(&#U)@#w$&&%)p%t$=#B$C#$$T%y#.#0$H%u#t$u)6#p$<(T$z(<#r%T%R&b%N(E%o*+%G)h$f#^#]#S&8#d,A$P&/#d#@#e$>()$^#7$<)F$P(&&o#U#S#z(x#.%e%Z%T%1#c#d$^&4#*#0(G#k&1#U#z%.$Q&*2S$R$*2T%O2U#i%Y&7#;)c#:&[$`&4$`&$$*#d&_#n#J%T(b#I#w$l#:*f%n){#J$T*f&D$O&?#*$<&D()(42V#:)g)~&<&A&D(P#F+()@$;&}(V#6#C&w#w#^%i&1%D(4())x#7&:#S2W%T%T(M#$&;&A)p#p%A#F&>%~&$$r&D#*#K$1#|%N&D&6$r*F$l%u&_$<&u&M&Q(F&#%-#U(4$e#-#;#$%N&M(G(P&J#($u&A&Q%9#N#K#W%o#r)z$l#;&g&82X*)#X#*#p$3(~%$#,$T,=%N(E#.$F$,(P).#O)o$l$P#>$*#=(4(X&1+=$,$]#i%C$^&A#q$$$5&R&T&*%>$i$j&8#.$`#I(+#G%i,X$$)g2Y$F&W$]#,$C&B()$`%q$,%N%~%=#0$<#P*b$T#P&I%-&W&_#:$=)F2Z%,$d(V%r#$$k%t$w2[#V$7%y#.)p%3$p&)&F%i0`%8$}$`$`$T$Q#b2]#X&I#.-.#L#q&L(?(&(3*?%R%o%<%N$P+O&g%e%N$j$`&a$;$T/(#N#q$`#p%u$M)p&I+q%,&}&#-.#v2^#$$$&A#V&a$H*+#$%T$C%.).&T&o$T#M&B#.$]$h$>+%$^%W%E#2%+&`#Y$i)>#I#|%r&w$|$T/(%^%Z#^%7$3$f$p2_++,f#0$T$&$T$z$;&m).%+$;(3-.$8%x%A2F#A&W$;$X+(1m#t%<#7&_2I%-${#6$=%E+W%>$((q#G#A#>%A#:(X#b2Z$S%R$h$m()#c#V.R$9#?$P(E%C#{)Z2[#F%@$&)o$5#$#N&k&A%M$m#x#V%>$F#^%G,D$<(G%a&D#X*m$))F(L%e$l(<-)#K$j(4()$`)(%1(M%^#Y)j(P#n&G(<#t&%#(,A&m*H$u#p$z&#)@%y$H#b$P%~$p$g%x$C$`#Y&b#w&*%i()(P#=%e$Q#i#I&4&:&1)c$k(&*f)z#w%q*f(F%T$;#F)p&A%~)p#|(4*1&?#$%A&F&<%o&A&Q&#%$%9#W$e$r&_(4$j$$&T$F%N,X&a$F+q(P(+$p&I)c#P$<#$$Q%o(?#N#q$Z$Z#E&M*Y$$&T%L$Z$>&>,v&B$p$>#B%-&O%-&B()$3%$$R.+#-$P$P$`&[#*+y&p#c(X%2&L#*$X%u%-.+%3#S#F/q#e$)#q$#&[)o*H(M%R$9#{#Y(3(3#N%,#O&A-J*H#B$1#B#0%h#0$1#q%<2`%,$b$1$|%M#U$m,,(l&a%5%C#K%v)p$O()%3(l&N%u&p#($*&A%u&P2a#p%=#N#6&A)c$O$1$O$>,v&B#B&O%-$1&N.+#U$P$R$`&[$3$>#c(X$#$1$O&[%R()#e#F2b*H#E(3(M2c#0#B$u#p$1%h#B#B#N&a%,%=,,(l%3%v(V(l2d)c#z#$$B&n$j$T#^#$#b%K$^2e%e#k$|2f(G$+*e#b#6#W$f$^$m%T#J#>,a%,$e$r%02g$X2h%4%42i#9#z#.2j&g&C%E$=)z(F*g#r$,$P$(+>#0#2&B%Z#i%E&,#z%-2k&B#k#b2l&p&;%T$)$P%w)p$+$P$g$g&2#$&n$L$m#Y)@&C#6$X2m$P2j#k$P._#V$^$J#*&k#B%K#0$e#0&g#U#U)p&n$,+4&1#J$,$m#(#B%=#F$+#^2n$k#p&A#.#,%w&M+l$m$[+-#O%c(+#6$,$,#0$P$d${$(#.%w#p$m#b%=&g#p#X#X#X%y-r#b)x2o%`#$2p#B%^$T&j#G#.$z)c#b%71b%/%9#Y$)#d([&##0#3$h$,&O$_(~)c$)([%9#.#p#3(4#X%`#y([#.#.#0#0#y#|2q2r$8$1$d#h$+#X%H$^$X&I%M%<#^&@&^#d#^$h$}#.$8&C%a#c$9%T$g*f$X#($~$p#{%q$R%2$m${#V)6#O2s#<%i#^$X(~$X#*$R$m(F#u$+(4&b&F#^#U,,$m#p#$$k#T&f$P#02t&g$W#.#h$^#R#6#U#K#p#.#u#^&b&I#X&D$k%q$W&g$X#$#K#X%<%3%3%3#9&)&)2u%v%T#W#>&)#W#@&@#W%v%q%q+W%L#1#1%<#:1[%=#:2v$C$Q$T$?$e(&#^$?%^$H#y++#R$m$[#|(F$r(V$|#$$b(T%r#J$R(U$^#9$m$O(T#J$/%M%M,;%Q&~(V#i$9$>%i$,%D2w&_%}%$$O#,#92x#Y(?#c(x&?2y#81D%3#i$8#Y$`(b$e$`$+)*%7$O%r2z&}#F%-,,&A)z-t$$#y#.$`&=#N(V#d$P$T(&%:$`&a#U$?#z%:%C#F#U#i&O$u,,(x$+%5#U#F#z(T%7$+(L%-#U.~(&%:(&#U$?#z&O#U$+(T#E#E0@$/$P#.$m([$+(H$B&L%i%i$+&L%M$m#q#d#:$C&)$*#q)<&O$}#$$}%e&$$*#(*[#0#S$|2{$e2|&}).$X$t#W&I2}#i%e%e#U/j,,$n#$#$&m&n#0#g&I#z%A&7(F$*%A&#$905%i$+#d&O2~%c%c)Y%G%c#w#w)@$C%G%x&O$T&m&J$P%^#$&]%1%e%e#B$1%F#0#4#B$P3##$&;#C%v&@&=$*&I%>&P-$&Q%d$b%]+m$z+u#B%=3$#x&b&F$P)Y%N#O)p%C#:$C&)&O#q)<$}$}#S$z2{#($|&$*[#0%N$X).2~/j%A$9)3%i&S&m#$)Y%=%c&O%i%i&m%1%9%e#4#B%e)p&Q&@#C%]&I3$#x)Y%C#K#?(7#z#*%2(U$[#R&`&d(7&_(H#Y%o#=#U$^$b&:()&:$](4#p/&&P&P(4%o%o%o&T%o)o#K3%#K$^%2%o$[#Y#=&:$b(4&P%o%o%q$]%q%q3&#7&H#.$C#=%4$`)x#q)6$?#0%~#7$m$]$])x$m3(#$+b%-#J3)%<%/3*#=%<#7$=$6$?%v$53+#9$b$S%/#q$^%~$(#B$B#p&H$;&q%e%+%Z&p%j#0#7$b%h3,#7$`%y#9$P%+#:%x%q#,#U%u%e+&$+#d&1&W%=%2%Y3-%E$d#U$z$Q&$&A$;(L#p$*(4&:(T#:$1(F&A&Q%-#0$l$H#-$*#4&B%H$U#$#.+-#>%9(T#U#q%2$d3.&b#B(F#N#q&#&8#s#7$C#.%4%E)6#p$?#0%H$]$m$`#7%<#=$=#$$(+-#q%3$B$5#p#9$;&p%e#0&q%Z)F%h$P%u$Q$*$z&:#N#:(F$;(4$l$H&Q#-#4#s&u$*)F#q$d$;${%-).&o&O%q$`%M$k#z$P$+$j$d&F$j&>#0#K$T$e3/#n%H$w#V#b$g30-U$[$+$1#b#T%R#A$;%<$$%4#$%,$F%,&S).%.&;&L$~#Y#V$x#Y#6$r%A$X%T&(#z$^#7%-%4%4#=(4&>&/(T#b&<&f#<*P%C$n&S$($6$;#V$m&#$~#T$6(4#Y&$%^(q#@&O&o&_%c%Z%e#>%E$k%N%y$~%5&/*H(T%G%t&m#(#(#B%q*b#B#F$b#^&/#;&/$T%q&1$T$p#0%1%C#*%t$*(x#=(7%4%c&:$T#>#b(4-2&f#p*)(&#B&;&2*b&B#(#b(~%N#p&##,(F$b&H%o#;%,%-#b#0$}(E$;%j%a#O%2$i(4%4*4&@$5&W#B&#%2#W#$#:%4)Y$~#B31%R&f#q#.(~#Y#p)c#X&P&>#03/$w%H%,-U$;%R*j#7#=#z#Y&2#V%4$x%A#$&`%a&>$m$5(E&#$6&/%o#X#>#B%E%^%Z#(&s&m%y%t%j&H&/#b$**b#^&M(4$T&B,@&##;#N$~#.(~#q$z#U#U#U#0$U#$+`&7#J%<%r&(%1$e%g$6%a%Y%I#F%c$.&/%-&m&~&6$,)z).%a+832(<+O&F(F&T)z%a(&*j$,%1&F+O%N(L(L#i+W#i%>*b33*H*H$e$f$l&v#t#T*H&F#e%D#6#w#e&v%1%<%-(x#z$(&<%,%Q$l(3#.&L,k(H#{%1#X&F%t%1&L&$$&%C%t)<$`$=#d(?#E#($<%T&F&L&>#-&Q&Q&X$}&d$T$T#s)c,,%8&F&d(Q&p&p(X#q#p&p&O&p&p#E$u#0#034#B34$j$#%t(435#)#0$#*f#(#(36$*%h#R37*f$}#B%a#@#0%c#($c#@#U(*%H&P%-(F#($}#3#B%2#0%w$?&-#R$R%4$h#.,P(E(l&D*[)6(F#J$n$|&;*p%N$1#d%N#7$f$d#|#A&/(F%3#*$/&O#638%439#8#g#z%-#.#U%,3:$;3;,O#6(c$&&`%<#z#c#Y$z#7#<$W$O&~#r%Y#q$(%M#U%.#V$m&d&#$S#$#$#9#U$5%g$/$P#F%=%>#z+W$l$=%Z%1#1(H([&D%^#0&q#n,O$.%j#^#83<$F)c%D#X#{#{+W&b#>#X&2#p%9$n#w#($&#q&q&,#.$h&*$z$~#<%G%q${#$*H%N#E$u#W$L$X&2#X&b%t#.(c#d#0$e#7$n3=%1%Y%E#V(?%t1F(b(b)c%C$D#U#U#0&,(x#c&1$<#B#8#8$`%-%e$^#z#p$P#*%4#d#7&.&_$1$T%]#^3>*b(4&>#7#7*H#w&f$O$b3?%9$T#($1&.$n$<&M$B%=#1#.%D%,$`$n&Q#p#8%o#.#.#V$u3@#43A#,$3#y(5#0%,#q$;$5$w%j&1&R&B&B$]$$#O$w(I#p*m#q$d%u%Y%V$D*b%2$U3B%i#X$u&I#r$k#x#.#0#d#r#X3C&#)S%T#q%e%N%u#X$P#0%w#.#A)6%N$f#R%3#R#g(c%N#A#c#z#R%<%Y#6&`$##J+W#U$($S1F%Y%V#.$5$P#c#q$w$.#X$<$`#X#7%D,O#{)c%Z#.%9&)$X#(&2%q*H$u$z${(c$h#W$n#7#w$d*Y%-$u%1$1#U&]%e#8#z&1%C&=(b*b&M#($O%u$b#h$`$B%o#y(5&Q&[%9#U#p$#&B#O&R#d$U#X%2%u+7#$#z#X#E%+#B#z%.#.#K#x#B#7#K%@%<&;#b$z%^$#$d$1%2#7#0)83D3E$$#6)c%T%<#B#G$&$f#K$1&6$W#F#x$X)S#z%4$1#X(b#b#F&;%/%,%a%H#T3F$b$z#I#0$^#0#G&W#0%v%i&n#^$((7$k#b#B$7%a%A&d#V#q3G$R%N#x%O#F$?$5$l$~%H&#$7(c%e#v%A#.&o)c%4$F#^%~#0$;%Z3H%-#p%Z#Y&o#W%1%e%e#L3I#^$n%G$5&}%N#6#r#z%M#P&L3J$T%r$h%N(l$`#Y&o#G&;#(#X#:%y%}$=3K#k#(#W#$#$#W#w%G#<#(&,$.#Y%,#$&R#.#r%i%H(I(x%M#8%1#d%1%e#J#t#z&,&o#B%3&;&/*H*f#d%i#b#^#Y#<(P$f%3%i&;$P)~#7%3$)&A#*&.(4#.#d$T($&O%/3L#$$b#B#.#X%v&{%1%1#$&o&>%a(L%v&C#.*F#n&M$b#$&6%H#b(4%9%R%-(~#P#0#^$$$m%1#=$5#$(E%-%i%j&1$]$5&T#B(L#E$P$P&o#u&R#0%i%N*F$P#y#$#6#V&##p#$#.$D#0%2#:$^#6%8$p%L%i&b$e(3#0&I%+%N3M&g(~(3%i%u%,#X#v3N#E#.&;%@#7&6#G$M%<%T$z#<%N#G%a$^$X%H%,&;#y%4#=#b$((7$l$7$~#F#v$R#^$;#X%~3O%e#0$P%1#^(l(I%M*H%r&L$T&,$.&;%j#d%3%e3O#8%/*f#^#$$b)~(4#.#$$`%3#$%i#n(4&T$5#E#0%N)c%2%i#d&b%u(~%N#W$X$`$P(<$`$`#B(<%N#A%d#.(U%d3P#V+z#V$`%L%L#0(4&C+z#O${#(%N#E*I#W#X#q#B%A%L#X%5#,#O#W#($X#B%d#u#u%3)>#z#1#1#z(U%,/;%O#z$P%G%,#1%H#K#z%,#1&>3Q3R%=(F&23S$d&1&1$H%J%v&7$R3T/`$R#r#X(c%H.g.g#$$T#T#p)6(F(F$T$W$)#A&@#$#*#B%,*f#B&)(3#X&^(&&H#B$`#B%x%M%T$W&H#$*f%2#B(&%N#b$d#z#z&[&[&;%d%,)>%:#V#b&b&M(5%4%-&;)>%4$C%L#]$C#w$z$z#<$d(T&;#6$u(L#(&;&A&f#r#r$d%q$1#R$h%4#I%,#k#7#A#7$9#^#p#W%h#p#B&o#=#p$P#B&I%-3U#8&O#^#^%Y$/%3#c$l)~#c%X#s#(&(#.#w#.#.#(#.%H&C&C%3#G$m$/%<3V$/#w%H#B#c%D$X$X$)%C$/3W)p#E%S*?$+#0$)#$${#c&2%,&;#B#0%e$_#$(<&2&@$)$H#G%H&C%3$m#Y$X%<%D#w3W#0*?%,$_&g#h%Q#h#B(q&g%Q&m)|$X(V&g%Q%F$##8(53X(3)@%31a$/(3##########################################################&B########################################################################################################################";
var _SPLIT_CACHE = {};
var _SEP_RE = /[\s\-_\/·—–:()\[\]]/;

function hasCjk(text) {
    var s = String(text ?? "");
    for (var i = 0; i < s.length; i++) {
        var code = s.charCodeAt(i);
        if (code >= _BASE && code <= _END)
            return true;
    }
    return false;
}

function readingsOf(ch) {
    if (!ch)
        return null;
    var code = ch.charCodeAt(0);
    if (code < _BASE || code > _END)
        return null;
    var off = (code - _BASE) * 2;
    var hi = _ALPHA.indexOf(_DATA[off]);
    var lo = _ALPHA.indexOf(_DATA[off + 1]);
    var id = hi * 90 + lo;
    if (id <= 0)
        return null;
    var cached = _SPLIT_CACHE[id];
    if (cached !== undefined)
        return cached;
    var arr = _SETS[id].split(",");
    _SPLIT_CACHE[id] = arr;
    return arr;
}

function _isWordBoundary(text, index) {
    if (index <= 0)
        return true;
    var prev = text[index - 1];
    if (_SEP_RE.test(prev))
        return true;
    var prevCode = text.charCodeAt(index - 1);
    var curCode = text.charCodeAt(index);
    var prevCjk = prevCode >= _BASE && prevCode <= _END;
    var curCjk = curCode >= _BASE && curCode <= _END;
    if (prevCjk !== curCjk)
        return true;
    if (prev >= "a" && prev <= "z" && text[index] >= "A" && text[index] <= "Z")
        return true;
    return false;
}

function _better(a, b) {
    if (!b)
        return true;
    var aExact = a.full + a.lit;
    var bExact = b.full + b.lit;
    if (aExact !== bExact)
        return aExact > bExact;
    if (a.skip !== b.skip)
        return a.skip < b.skip;
    if (a.init !== b.init)
        return a.init < b.init;
    return a.end < b.end;
}

function _matchFrom(text, lower, token, start) {
    var n = text.length;
    var m = token.length;
    var memo = {};

    function dfs(i, j) {
        if (j === m)
            return { end: i, full: 0, lit: 0, init: 0, skip: 0 };
        if (i >= n)
            return null;

        var key = i * (m + 1) + j;
        if (memo[key] !== undefined)
            return memo[key];

        var best = null;
        var ch = text[i];

        // Allow skipping up to 3 consecutive separators once matching has started.
        if (j > 0 && _SEP_RE.test(ch)) {
            var k = i;
            while (k < n && (k - i) < 3 && _SEP_RE.test(text[k]))
                k++;
            for (var s = i + 1; s <= k; s++) {
                var subSep = dfs(s, j);
                if (subSep) {
                    var candSep = {
                        end: subSep.end,
                        full: subSep.full,
                        lit: subSep.lit,
                        init: subSep.init,
                        skip: subSep.skip + (s - i)
                    };
                    if (_better(candSep, best))
                        best = candSep;
                }
            }
        }

        var readings = readingsOf(ch);
        if (readings) {
            // 1. Direct Hanzi literal match
            if (ch === token[j]) {
                var subLit = dfs(i + 1, j + 1);
                if (subLit) {
                    var candLit = {
                        end: subLit.end,
                        full: subLit.full,
                        lit: subLit.lit + 1,
                        init: subLit.init,
                        skip: subLit.skip
                    };
                    if (_better(candLit, best))
                        best = candLit;
                }
            }

            // 2. Syllable-aligned Pinyin matches
            var remLen = m - j;
            var remStr = token.slice(j);
            for (var r = 0; r < readings.length; r++) {
                var py = readings[r];
                var forms = py.indexOf("v") >= 0 ? [py, py.replace(/v/g, "u")] : [py];
                for (var f = 0; f < forms.length; f++) {
                    var p = forms[f];
                    var plen = p.length;

                    // Full syllable match
                    if (remLen >= plen && token.slice(j, j + plen) === p) {
                        var subFull = dfs(i + 1, j + plen);
                        if (subFull) {
                            var candFull = {
                                end: subFull.end,
                                full: subFull.full + 1,
                                lit: subFull.lit,
                                init: subFull.init,
                                skip: subFull.skip
                            };
                            if (_better(candFull, best))
                                best = candFull;
                        }
                    }

                    // Double-consonant initial (zh / ch / sh)
                    if (plen >= 2 && remLen >= 2) {
                        var dInit = p.slice(0, 2);
                        if ((dInit === "zh" || dInit === "ch" || dInit === "sh") && token.slice(j, j + 2) === dInit) {
                            var subD = dfs(i + 1, j + 2);
                            if (subD) {
                                var candD = {
                                    end: subD.end,
                                    full: subD.full,
                                    lit: subD.lit,
                                    init: subD.init + 1,
                                    skip: subD.skip
                                };
                                if (_better(candD, best))
                                    best = candD;
                            }
                        }
                    }

                    // Single initial
                    if (token[j] === p[0]) {
                        var subI = dfs(i + 1, j + 1);
                        if (subI) {
                            var candI = {
                                end: subI.end,
                                full: subI.full,
                                lit: subI.lit,
                                init: subI.init + 1,
                                skip: subI.skip
                            };
                            if (_better(candI, best))
                                best = candI;
                        }
                    }

                    // Tail syllable prefix (only at end of token)
                    if (remLen < plen && p.slice(0, remLen) === remStr) {
                        var candTail = {
                            end: i + 1,
                            full: 0,
                            lit: 0,
                            init: 1,
                            skip: 0
                        };
                        if (_better(candTail, best))
                            best = candTail;
                    }
                }
            }
        } else {
            // Non-CJK literal match
            if (lower[i] === token[j]) {
                var subAsc = dfs(i + 1, j + 1);
                if (subAsc) {
                    var candAsc = {
                        end: subAsc.end,
                        full: subAsc.full,
                        lit: subAsc.lit + 1,
                        init: subAsc.init,
                        skip: subAsc.skip
                    };
                    if (_better(candAsc, best))
                        best = candAsc;
                }
            }
        }

        memo[key] = best;
        return best;
    }

    return dfs(start, 0);
}

function _scoreToken(text, lower, token) {
    var n = text.length;
    var trimmedLen = text.replace(/\s+$/, "").length;
    var bestMatch = null;
    var bestStart = -1;
    var bestBoundary = false;

    for (var start = 0; start < n; start++) {
        var res = _matchFrom(text, lower, token, start);
        if (!res)
            continue;
        var boundary = _isWordBoundary(text, start);
        if (!bestMatch) {
            bestMatch = res;
            bestStart = start;
            bestBoundary = boundary;
            continue;
        }
        var aRoot = start === 0 ? 2 : (boundary ? 1 : 0);
        var bRoot = bestStart === 0 ? 2 : (bestBoundary ? 1 : 0);
        if (aRoot !== bRoot) {
            if (aRoot > bRoot) {
                bestMatch = res;
                bestStart = start;
                bestBoundary = boundary;
            }
            continue;
        }
        if (_better(res, bestMatch)) {
            bestMatch = res;
            bestStart = start;
            bestBoundary = boundary;
        }
    }

    if (!bestMatch)
        return 0;

    var s = 100
        + (bestStart === 0 ? 200 : (bestBoundary ? 160 : 0))
        + (bestStart === 0 && bestMatch.end >= trimmedLen ? 150 : 0)
        + 20 * bestMatch.full
        + 15 * bestMatch.lit
        + 5 * bestMatch.init
        - 10 * bestMatch.skip
        - bestStart * 2
        - Math.min(80, Math.floor(n / 4));

    return s < 1 ? 1 : s;
}

function score(text, query) {
    var s = String(text ?? "");
    var q = String(query ?? "").trim().toLowerCase();
    if (!s || !q || !hasCjk(s))
        return 0;

    var tokens = q.split(/\s+/);
    var lower = s.toLowerCase();
    var total = 0;
    for (var i = 0; i < tokens.length; i++) {
        var tok = tokens[i];
        if (!tok)
            continue;
        var ts = _scoreToken(s, lower, tok);
        if (ts <= 0)
            return 0;
        total += ts;
    }
    return total;
}

function matches(text, query) {
    return score(text, query) > 0;
}

function mergeResults(items, baseMatches, selectorFn, query) {
    var q = String(query ?? "").trim().toLowerCase();
    var base = baseMatches ?? [];
    if (!q)
        return base;

    var itemList = items ?? [];
    var pinyinScored = [];
    var pinyinMap = new Map();

    for (var i = 0; i < itemList.length; i++) {
        var item = itemList[i];
        var label = String(selectorFn(item) ?? "");
        if (!hasCjk(label))
            continue;
        var sc = score(label, q);
        if (sc > 0) {
            var entry = { item: item, score: sc, len: label.trim().length };
            pinyinScored.push(entry);
            pinyinMap.set(item, entry);
        }
    }

    if (pinyinScored.length === 0)
        return base;

    // Split existing baseMatches into direct literal substring matches vs scattered fuzzy hits.
    var literalPrefix = [];
    var literalSub = [];
    var scatteredBase = [];
    var seen = new Set();

    for (var j = 0; j < base.length; j++) {
        var bItem = base[j];
        if (seen.has(bItem))
            continue;
        seen.add(bItem);
        var bLabel = String(selectorFn(bItem) ?? "").trim().toLowerCase();
        if (bLabel.indexOf(q) === 0)
            literalPrefix.push(bItem);
        else if (bLabel.indexOf(q) > 0)
            literalSub.push(bItem);
        else
            scatteredBase.push(bItem);
    }

    var strongPinyin = [];
    var weakPinyin = [];
    for (var k = 0; k < pinyinScored.length; k++) {
        var pe = pinyinScored[k];
        if (pe.score >= 250)
            strongPinyin.push(pe);
        else
            weakPinyin.push(pe);
    }

    var cmpPinyin = function (a, b) {
        if (a.score !== b.score)
            return b.score - a.score;
        return a.len - b.len;
    };
    strongPinyin.sort(cmpPinyin);
    weakPinyin.sort(cmpPinyin);

    var out = [];
    var emitted = new Set();
    var pushUnique = function (it) {
        if (!emitted.has(it)) {
            emitted.add(it);
            out.push(it);
        }
    };

    for (var p1 = 0; p1 < literalPrefix.length; p1++)
        pushUnique(literalPrefix[p1]);
    for (var p2 = 0; p2 < literalSub.length; p2++)
        pushUnique(literalSub[p2]);
    for (var s1 = 0; s1 < strongPinyin.length; s1++)
        pushUnique(strongPinyin[s1].item);
    for (var sb = 0; sb < scatteredBase.length; sb++)
        pushUnique(scatteredBase[sb]);
    for (var w1 = 0; w1 < weakPinyin.length; w1++)
        pushUnique(weakPinyin[w1].item);

    return out;
}
