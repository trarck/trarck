GL2.Sprite里Animation的释放
    如果是setImage则会自动释放Animation。如果setAnimation设置的Animation，不会自动释放，要手动调用Animation的destroy方法。
    所以，最后用一个AnimationFactory管理Animation，加入引用计数，代理Animation的destroy。在destroy的时候减少引用计数，直到为0才真正释放。

注意：GL2里的类，大部分类的destroy只会释放自身，子元素只移除不释放，子元素要手动释放(调用destroy)
 p_in=p_in.replace("/cygdrive/d","d:");

GL2.Text 如果fontSize在于size则不会显示。

	exec('java -jar d:/sdk/Tools/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar ' + p_in + ' -o ' + p_in + ' --charset utf-8', 