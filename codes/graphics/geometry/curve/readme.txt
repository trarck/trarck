1.²Î¿¼£ºthreejs/src/extras/
2.Bezier bezier = Bezier (p0, p1, p2, p3);

chord = (p3-p0).Length;
cont_net = (p0 - p1).Length + (p2 - p1).Length + (p3 - p2).Length;

app_arc_length = (cont_net + chord) / 2;
3.Bezier2
    v.x = 2*(b.x - a.x);
    v.y = 2*(b.y - a.y);
    w.x = c.x - 2*b.x + a.x;
    w.y = c.y - 2*b.y + a.y;

    uu = 4*(w.x*w.x + w.y*w.y);

    if(uu < 0.00001)
    {
        return (float) Math.sqrt((c.x - a.x)*(c.x - a.x) + (c.y - a.y)*(c.y - a.y));
    }

    vv = 4*(v.x*w.x + v.y*w.y);
    ww = v.x*v.x + v.y*v.y;

    t1 = (float) (2*Math.sqrt(uu*(uu + vv + ww)));
    t2 = 2*uu+vv;
    t3 = vv*vv - 4*uu*ww;
    t4 = (float) (2*Math.sqrt(uu*ww));

    return (float) ((t1*t2 - t3*Math.log(t2+t1) -(vv*t4 - t3*Math.log(vv+t4))) / (8*Math.pow(uu, 1.5)));
