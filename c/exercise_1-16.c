#include <stdio.h>

#define MAXLINE 20

int get_line(char line[], int maxline);
void copy(char to[], char from[]);

int main()
{
    /* Exercise 1-16
       Revise the main routine of the longest-line program so it will
       correctly print the length of arbitrarily long input lines,
       and as much as possible of the text.
    */
    printf("Input text (press ctrl+d to end):\n");
    int len;
    int max;
    char line[MAXLINE];
    char longest[MAXLINE];
    
    max = 0;
    while ((len = get_line(line, MAXLINE)) > 0)
    {
        if (len > max)
        {
            max = len;
            copy(longest, line);
        }
    }
    if (max > 0)
        printf("%s\nNumber of characters: %d\n", longest, max);
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

void copy(char to[], char from[])
{
    int i = 0;
    while ((to[i] = from[i]) != '\0')
        ++i;
}
