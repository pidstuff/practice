#include <stdio.h>

#define MAXLINE 1000
#define LINELIMIT 20

int get_line(char line[], int maxline);

int main()
{
    /* Exercise 1-17
       Write a program to print all input lines that are longer than 80 characters.
    */
    printf("Input text (press ctrl+d to end):\n");
    int i;
    int len;
    char line[MAXLINE];
    
    while ((len = get_line(line, MAXLINE)) > 0)
    {
        if (len >= LINELIMIT)
        {
            for (i=0; line[i] != '\0'; ++i)
                printf("%c", line[i]);
        }
    }
    return 0;
}

int get_line(char s[], int lim)
{
    int c, i, m;
    i = m = 0;
    while ((c = getchar()) != EOF && c != '\n')
    {
        if (i < lim - 2)
        {
            s[i] = c;
            ++i;
        }
        ++m;
    }
    if (c == '\n')
    {
        s[i] = c;
        ++i;
        ++m;
    }
    s[i] = '\0';
    return m;
}
