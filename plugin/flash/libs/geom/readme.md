flash里的matrix

通常
M=RxSKxS

        1     tanx
SK =(               )
      tany     1

这样M最后为

    Sx*(cos(a)-tan(y)*sin(a))           Sy*(tan(x)*cos(a)-sin(a))           a       c

(                                                                    )=(                )

    Sx*(sin(a)+tan(y)*cos(a))           Sy*(tan(x)*sin(a)+cos(a))           b       c

  
            Sx*Sx
==>    -------------- = a*a+b*b
        cos(y)*cos(y)

          Sy*Sy
      --------------- = c*c+d*d
       cos(x)*cos(x)

=> Sx=sqrt( (a*cos(y)) * (a*cos(y) + (b*cos(y)) * (b*cos(y) )
   Sy=sqrt( (c*cos(x)) * (c*cos(x) + (d*cos(x)) * (d*cos(x) )

由于cos(y),cos(x)未知，则不好求出Sx,Sy。

                              cos(y)       0            a   c
分析可以看出等式左边相当于(                     ) x (           )
                                0       cos(x)          b   d

      cos(y)    0                 1/cos(y)     0
令A=(                   )   A'=(                     )
        0     cos(x)                0       1/cos(x)

       cos(y)   sin(x)
SK'=(                   )
       sin(y)   cos(x)

 则
 SK=SK' x A'
 M=RxSK'xA'*S
而A'和S可以交换
则
M=R x SK'x S x A'

令
M'= M x A = R x SK'x S
这样就可以保持R和SK'一致

最后
      Sx*cos(y+a)       Sy*sin(x-a)  
M'=(                                    )
      Sx*sin(y+a)       Sy*cos(x-a)

这样可以容易求出Sx,Sy.但还是无法确定a,x,y的角度。

如果由flash的矩阵得到普通矩阵

M= M' x A'

如果 x,y为0则A'为单位矩阵。


如何解M'：由于5个变量4个等式，可以得出元数个解

1.令a=y,则可能得到a,x,y的解。
2.令y=0,可以得出解。

注意：
    如果b/a=-c/d则表示只有旋转，没有倾斜。则M'和M是一样的。
    flash编辑器里，旋转和倾斜不会一起出现。