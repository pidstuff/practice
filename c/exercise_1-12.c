#include <stdio.h>

int main()
{
    /* Exercise 1-12
       Write a program that prints its input one word per line.
    */
    printf("Input text (press ctrl+d to end):\n");
    int c, in, out, state = 0;
    in = 1;
    
    while ((c = getchar()) != EOF)
    {
        if (c == ' ' || c == '\t')
            state = out;
        else if (state == out)
        {
            state = in;
            printf("\n");
            putchar(c);
        }
        else
            putchar(c);
    }
}
